import type Stripe from "stripe";
import type { DonationSubmission } from "./validation";

type ReservedContribution = {
  id: string;
  election_slug: string;
};

export function buildContributionCheckoutSession(
  donor: DonationSubmission,
  contribution: ReservedContribution,
  siteUrl: string,
  expiresAt: number,
): Stripe.Checkout.SessionCreateParams {
  return {
    ui_mode: "elements",
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: donor.email,
    client_reference_id: contribution.id,
    expires_at: expiresAt,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: donor.amountCents,
          product_data: {
            name: "Campaign contribution",
            description:
              "CJ Turrentine for Vance County Commissioner, District 3",
          },
        },
      },
    ],
    return_url: `${siteUrl}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
    metadata: {
      contribution_id: contribution.id,
      election_slug: contribution.election_slug,
    },
    payment_intent_data: {
      metadata: {
        contribution_id: contribution.id,
        election_slug: contribution.election_slug,
        campaign: "CJ Turrentine for Commissioner",
      },
    },
  };
}
