import { NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const { priceId, beatId, licenseType, slug, currency } = await req.json();

    if (!priceId || !beatId || !licenseType || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const session = await createCheckoutSession({
      priceId,
      beatId,
      licenseType,
      slug,
      currency,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create checkout session';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
