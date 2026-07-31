import type Stripe from "stripe";
import { recordStripeContributionEvent } from "@/lib/contribution-store";
import { getStripe } from "@/lib/stripe";
import { parseStripeContributionEvent } from "@/lib/stripe-event";
import { enrichStripeContributionUpdate } from "@/lib/stripe-payment";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

  if (!signature || !secret) {
    return new Response("Webhook configuration unavailable.", { status: 400 });
  }

  const body = await request.text();
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, secret);
  } catch {
    return new Response("Invalid webhook signature.", { status: 400 });
  }

  try {
    const parsed = parseStripeContributionEvent(event);
    const update = parsed
      ? await enrichStripeContributionUpdate(getStripe(), parsed)
      : null;
    if (!update) {
      return new Response("Received.", { status: 200 });
    }
    await recordStripeContributionEvent(update);
    return new Response("Received.", { status: 200 });
  } catch (error) {
    console.error("Stripe webhook processing failed.", {
      error: error instanceof Error ? error.name : "UnknownError",
      eventId: event.id,
      eventType: event.type,
    });
    return new Response("Webhook processing failed.", { status: 500 });
  }
}
