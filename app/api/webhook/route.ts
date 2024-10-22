import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { createServiceClient } from '@/utils/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Helper function to update user data in Supabase
  const updateUserData = async (stripeCustomerId: string, userId: string, updateData: any) => {
    console.log('Attempting to update user data:', { stripeCustomerId, userId, updateData });

    try {
      // First, let's check if the user exists and get their current credits
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (fetchError) {
        console.error('Error fetching user:', fetchError);
        throw fetchError;
      }

      if (!existingUser) {
        console.error('User not found:', userId);
        throw new Error('User not found');
      }

      console.log('Existing user data:', existingUser);

      // Calculate new credit amount
      let newCredits = existingUser.credits;
      if (updateData.credits && typeof updateData.credits === 'object' && 'increment' in updateData.credits) {
        newCredits += updateData.credits.increment;
      } else if (typeof updateData.credits === 'number') {
        newCredits = updateData.credits;
      }

      // Now, let's update the user data
      const { data, error } = await supabase
        .from('users')
        .update({
          stripe_customer_id: stripeCustomerId,
          subscription: updateData.subscription || existingUser.subscription,
          credits: newCredits,
          status: updateData.status || existingUser.status
        })
        .eq('user_id', userId)
        .select();

      if (error) {
        console.error('Error updating user data:', error);
        throw error;
      }

      if (data && data.length > 0) {
        console.log('User data updated successfully:', data[0]);
      } else {
        console.error('No rows updated. This should not happen as we verified the user exists.');
      }

      return data;
    } catch (error) {
      console.error('Failed to update user data:', error);
      throw error;
    }
  };

  console.log('Received event:', event.type);

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Checkout session completed:', session);

        if (session.mode === 'payment' && session.metadata && session.metadata.user_id) {
          // Credit purchase
          const credits = parseInt(session.metadata.credits || '0', 10);
          const userId = session.metadata.user_id;

          console.log('Updating user credits for one-time purchase:', { userId, credits });
          await updateUserData(session.customer as string, userId, {
            credits: { increment: credits },
          });
        } else if (session.mode === 'subscription') {
          // Subscription purchase
          if (session.metadata) {
            const subscription = session.metadata.plan_name;
            const credits = parseInt(session.metadata.credits || '0', 10);
            const userId = session.metadata.user_id;

            if (userId) {
              console.log('Updating user data for checkout.session.completed:', { userId, subscription, credits });
              await updateUserData(session.customer as string, userId, {
                subscription,
                credits,
                status: 'Active'
              });
            } else {
              console.error('Missing user_id in session metadata');
            }
          } else {
            console.error('Missing metadata in subscription session');
          }
        } else {
          console.error('Missing required data in checkout.session.completed:', session);
        }
        break;

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const updatedSubscription = event.data.object as Stripe.Subscription;
        console.log('Subscription updated or deleted:', updatedSubscription);

        if (updatedSubscription.customer && updatedSubscription.metadata.user_id) {
          const updatedPlanName = updatedSubscription.status === 'active' ? updatedSubscription.metadata.plan_name : 'Cancelled';
          const updatedCredits = updatedSubscription.status === 'active' ? parseInt(updatedSubscription.metadata.credits || '0', 10) : 0;
          const updatedStatus = updatedSubscription.status === 'active' ? 'Active' : 'Inactive';

          console.log('Updating user data for subscription update/delete:', { userId: updatedSubscription.metadata.user_id, subscription: updatedPlanName, credits: updatedCredits, status: updatedStatus });
          await updateUserData(updatedSubscription.customer as string, updatedSubscription.metadata.user_id, {
            subscription: updatedPlanName,
            credits: updatedCredits,
            status: updatedStatus
          });
        }
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Invoice payment succeeded:', invoice);

        if (invoice.customer && invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
          console.log('Retrieved subscription:', subscription);

          if (subscription.metadata.user_id) {
            const planName = subscription.metadata.plan_name;
            const credits = parseInt(subscription.metadata.credits || '0', 10);

            console.log('Updating user data for invoice.payment_succeeded:', { userId: subscription.metadata.user_id, subscription: planName, credits: credits });
            await updateUserData(invoice.customer as string, subscription.metadata.user_id, {
              subscription: planName,
              credits: credits,
              status: 'Active'
            });
          }
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
