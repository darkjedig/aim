import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia',
});

export async function POST(req: Request) {
  try {
    const { priceId, quantity, successUrl, cancelUrl, mode } = await req.json();
    console.log('Received request:', { priceId, quantity, successUrl, cancelUrl, mode });

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Missing Authorization header' }, { status: 401 });
    }

    const supabase = createServerComponentClient({ cookies });
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.split(' ')[1]);

    if (authError || !user) {
      console.error('Authentication error:', authError);
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    console.log('User authenticated:', user);

    const { data: userData } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    let customerId = userData?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabaseUserId: user.id },
      });
      customerId = customer.id;

      await supabase
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('user_id', user.id);
    }

    let session;
    if (mode === 'payment') {
      // Fetch the credit pricing from Supabase
      const { data: creditPricing, error: creditPricingError } = await supabase
        .from('credit_pricing')
        .select('*')
        .single();

      if (creditPricingError || !creditPricing) {
        console.error('Error fetching credit pricing:', creditPricingError);
        return NextResponse.json({ error: 'Failed to fetch credit pricing' }, { status: 500 });
      }

      const totalAmount = Math.round(creditPricing.price_per_credit * quantity * 100); // Convert to cents

      // One-time purchase for credits
      session = await stripe.checkout.sessions.create({
        customer: customerId,
        line_items: [
          {
            price_data: {
              currency: 'gbp',
              product_data: {
                name: `${quantity} Credits`,
              },
              unit_amount: totalAmount,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl,
        metadata: {
          user_id: user.id,
          credits: quantity.toString(),
        },
      });
    } else {
      // Subscription
      const { data: planData } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('stripe_price_id', priceId)
        .single();

      if (!planData) {
        console.error('Plan data not found for price ID:', priceId);
        return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
      }

      const metadata = {
        user_id: user.id,
        plan_name: planData.name,
        credits: planData.credits.toString(),
      };

      session = await stripe.checkout.sessions.create({
        customer: customerId,
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl,
        metadata: metadata,
        subscription_data: {
          metadata: metadata,
        },
      });
    }

    if (session.url) {
      return NextResponse.json({ url: session.url });
    } else {
      throw new Error('Failed to create checkout session URL');
    }
  } catch (err: any) {
    console.error('Error in create-checkout-session:', err);
    return NextResponse.json({ error: err.message || 'An unexpected error occurred' }, { status: 500 });
  }
}
