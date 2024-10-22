import { loadStripe } from '@stripe/stripe-js';

export const getStripe = () => {
  const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  
  if (!stripePublishableKey) {
    throw new Error('Stripe publishable key is not set in environment variables');
  }

  return loadStripe(stripePublishableKey);
};
