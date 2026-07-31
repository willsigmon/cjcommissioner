import { describe, expect, it } from "vitest";
import type { DonationSubmission } from "./validation";
import { buildContributionCheckoutSession } from "./donation-session";

const donor: DonationSubmission = {
  clientAttemptId: "019fb298-d014-7000-8000-000000000001",
  fullName: "Jordan Neighbor",
  email: "jordan@example.com",
  phone: "(252) 555-0100",
  address: {
    line1: "123 Main Street",
    line2: "Apartment 4",
    city: "Henderson",
    state: "NC",
    postalCode: "27537",
  },
  occupation: "Teacher",
  employer: "Vance County Schools",
  amountCents: 10_000,
  eligibilityConfirmed: true,
};

describe("Stripe contribution session", () => {
  it("keeps campaign reporting PII out of Stripe metadata", () => {
    const session = buildContributionCheckoutSession(
      donor,
      {
        id: "019fb298-d014-7000-8000-000000000002",
        election_slug: "2026-general",
      },
      "https://www.cjcommissioner.com",
      1_800_000_000,
    );
    const metadata = JSON.stringify({
      session: session.metadata,
      paymentIntent: session.payment_intent_data?.metadata,
    });

    expect(metadata).toContain("contribution_id");
    expect(metadata).toContain("election_slug");
    expect(metadata).not.toContain(donor.fullName);
    expect(metadata).not.toContain(donor.phone);
    expect(metadata).not.toContain(donor.address.line1);
    expect(metadata).not.toContain(donor.occupation);
    expect(metadata).not.toContain(donor.employer);
  });

  it("creates a one-time card and wallet compatible session", () => {
    const session = buildContributionCheckoutSession(
      donor,
      {
        id: "019fb298-d014-7000-8000-000000000002",
        election_slug: "2026-general",
      },
      "https://www.cjcommissioner.com",
      1_800_000_000,
    );

    expect(session.mode).toBe("payment");
    expect(session.payment_method_types).toEqual(["card"]);
    expect(session.line_items?.[0]?.price_data?.unit_amount).toBe(10_000);
    expect(session.return_url).toContain("{CHECKOUT_SESSION_ID}");
  });
});
