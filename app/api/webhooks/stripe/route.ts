import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { markBeatAsSold } from '@/lib/supabase';
import { sendFulfillmentEmail } from '@/lib/email';

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

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const payload = await req.text();
  const headerList = await headers();
  const sig = headerList.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(payload, sig, webhookSecret);
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${err.message}` },
      { status: 400 }
    );
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const beatId = session.metadata?.beatId;
      const licenseType = (session.metadata?.licenseType as 'wav' | 'stems') || 'wav';
      const customerEmail = session.customer_details?.email;

      if (!beatId || !customerEmail) {
        console.error('Missing beatId or customer email in session', session.id);
        break;
      }

      // Mark beat as sold in the database
      await markBeatAsSold(beatId);

      // Build download URL — files should be hosted at a storage bucket
      const downloadUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/download/${beatId}?license=${licenseType}`;

      // Send fulfillment email
      await sendFulfillmentEmail({
        to: customerEmail,
        beatTitle: session.metadata?.beatTitle || 'Your Beat',
        licenseType,
        downloadUrl,
      });

      console.log('Order fulfilled for session:', session.id);
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
