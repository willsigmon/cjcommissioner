import { classifyWebhookEvent, getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

  if (!signature || !secret) {
    return new Response("Webhook configuration unavailable.", { status: 400 });
  }

  const body = await request.text();
  try {
    const event = getStripe().webhooks.constructEvent(body, signature, secret);

    // These handlers intentionally perform no non-idempotent side effects.
    // Stripe remains the contribution system of record, so safe event replays
    // receive the same successful acknowledgement.
    classifyWebhookEvent(event);
    return new Response("Received.", { status: 200 });
  } catch {
    return new Response("Invalid webhook signature.", { status: 400 });
  }
}
