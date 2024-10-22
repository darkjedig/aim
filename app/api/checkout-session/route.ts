import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia',
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');

  console.log('Received session ID:', sessionId);

  try {
    if (!sessionId) {
      throw new Error('Session ID is required');
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'subscription'],
    });

    console.log('Retrieved session:', session);

    return NextResponse.json(session);
  } catch (err: any) {
    console.error('Error retrieving session:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
