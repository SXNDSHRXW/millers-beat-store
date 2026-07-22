import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY!;

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-02-24.acacia',
});

export async function createCheckoutSession({
  priceId,
  beatId,
  licenseType,
  slug,
  currency,
}: {
  priceId: string;
  beatId: string;
  licenseType: 'wav' | 'stems';
  slug: string;
  currency?: string;
}) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/beats/${slug}`,
    metadata: {
      beatId,
      licenseType,
      currency: currency || 'USD',
    },
  });

  return session;
}
