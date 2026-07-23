import Stripe from 'stripe';

let _stripe: Stripe | null = null;

function getStripe() {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-02-24.acacia',
      httpClient: Stripe.createFetchHttpClient(),
    });
  }
  return _stripe;
}

export async function createCheckoutSession({
  priceId,
  beatId,
  licenseType,
  slug,
  currency,
  beatTitle,
}: {
  priceId: string;
  beatId: string;
  licenseType: 'wav' | 'stems';
  slug: string;
  currency?: string;
  beatTitle?: string;
}) {
  const session = await getStripe().checkout.sessions.create({
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
      beatTitle: beatTitle || '',
    },
  });

  return session;
}
