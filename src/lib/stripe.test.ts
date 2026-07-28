import Stripe from "stripe";
import { describe, expect, it } from "vitest";
import { classifyWebhookEvent } from "./stripe";

describe("Stripe webhook verification", () => {
  it("accepts a valid test signature and rejects a changed payload", () => {
    const stripe = new Stripe("sk_test_placeholder");
    const secret = "whsec_test_secret";
    const payload = JSON.stringify({
      id: "evt_test",
      object: "event",
      type: "checkout.session.completed",
      data: { object: { id: "cs_test" } },
    });
    const header = stripe.webhooks.generateTestHeaderString({
      payload,
      secret,
    });

    expect(() =>
      stripe.webhooks.constructEvent(payload, header, secret),
    ).not.toThrow();
    expect(() =>
      stripe.webhooks.constructEvent(`${payload} `, header, secret),
    ).toThrow();
  });

  it("classifies relevant event types without side effects", () => {
    const event = {
      type: "checkout.session.async_payment_failed",
    } as Stripe.Event;
    expect(classifyWebhookEvent(event)).toBe("failed");
    expect(
      classifyWebhookEvent({ type: "customer.created" } as Stripe.Event),
    ).toBe("ignored");
  });
});
