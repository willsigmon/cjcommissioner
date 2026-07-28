import { NextResponse } from "next/server";
import {
  donationsAreEnabled,
  getCanonicalSiteUrl,
  getStripe,
} from "@/lib/stripe";
import { isAllowedOrigin, validateDonationPayload } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json(
      { ok: false, message: "This contribution could not be verified." },
      { status: 403 },
    );
  }

  if (!donationsAreEnabled()) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Online contributions are not open yet. Campaign and treasurer setup is still in progress.",
      },
      { status: 503 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Check the form and try again." },
      { status: 400 },
    );
  }

  const validated = validateDonationPayload(payload);
  if (!validated.ok) {
    return NextResponse.json(
      {
        ok: false,
        message: validated.message,
        fields: validated.fields,
      },
      { status: 400 },
    );
  }

  try {
    const donor = validated.data;
    const siteUrl = getCanonicalSiteUrl();
    const session = await getStripe().checkout.sessions.create({
      ui_mode: "elements",
      mode: "payment",
      customer_email: donor.email,
      client_reference_id: crypto.randomUUID(),
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: donor.amountCents,
            product_data: {
              name: "Campaign contribution",
              description: "CJ Turrentine for Vance County Commissioner, District 3",
            },
          },
        },
      ],
      return_url: `${siteUrl}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        donor_name: donor.fullName,
        donor_phone: donor.phone ?? "",
        mailing_line1: donor.address.line1,
        mailing_line2: donor.address.line2 ?? "",
        mailing_city: donor.address.city,
        mailing_state: donor.address.state,
        mailing_postal_code: donor.address.postalCode,
        occupation: donor.occupation,
        employer: donor.employer,
        amount_cents: String(donor.amountCents),
        personal_funds_attested: "true",
        own_name_attested: "true",
        lawful_source_attested: "true",
        limit_acknowledged: "true",
      },
      payment_intent_data: {
        metadata: {
          donor_name: donor.fullName,
          occupation: donor.occupation,
          employer: donor.employer,
          campaign: "CJ Turrentine for Commissioner",
        },
      },
    });

    if (!session.client_secret) {
      throw new Error("Stripe did not return a Checkout client secret.");
    }

    return NextResponse.json({
      ok: true,
      clientSecret: session.client_secret,
      sessionId: session.id,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message:
          "The secure payment form is temporarily unavailable. No contribution was processed.",
      },
      { status: 503 },
    );
  }
}
