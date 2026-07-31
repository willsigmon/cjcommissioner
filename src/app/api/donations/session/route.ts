import { checkRateLimit } from "@vercel/firewall";
import { NextResponse } from "next/server";
import {
  attachStripeSession,
  ContributionAttemptTerminalError,
  ContributionLimitError,
  markContributionFailed,
  reserveContribution,
} from "@/lib/contribution-store";
import {
  donationsAreEnabled,
  getCanonicalSiteUrl,
  getStripe,
} from "@/lib/stripe";
import { buildContributionCheckoutSession } from "@/lib/donation-session";
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

  const rateLimitId = process.env.VERCEL_DONATION_RATE_LIMIT_ID?.trim();
  if (rateLimitId) {
    const result = await checkRateLimit(rateLimitId, { request });
    if (result.rateLimited) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Too many contribution attempts. Please wait ten minutes and try again.",
        },
        { status: 429 },
      );
    }
    if (result.error && process.env.NODE_ENV === "production") {
      return NextResponse.json(
        {
          ok: false,
          message:
            "The secure contribution form is temporarily unavailable. No contribution was processed.",
        },
        { status: 503 },
      );
    }
  } else if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      {
        ok: false,
        message:
          "The secure contribution form is temporarily unavailable. No contribution was processed.",
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

  const donor = validated.data;
  let contributionId: string | null = null;
  let phase = "reserve";

  try {
    const contribution = await reserveContribution(
      donor,
      donor.clientAttemptId,
    );
    contributionId = contribution.id;
    phase = "stripe_session";
    const siteUrl = getCanonicalSiteUrl();
    const expiresAt = Math.floor(Date.now() / 1_000) + 30 * 60;
    const session = await getStripe().checkout.sessions.create(
      buildContributionCheckoutSession(
        donor,
        contribution,
        siteUrl,
        expiresAt,
      ),
      {
        idempotencyKey: `campaign-contribution-${contribution.id}`,
      },
    );

    if (!session.client_secret) {
      throw new Error("Stripe did not return a Checkout client secret.");
    }

    phase = "ledger_attach";
    await attachStripeSession(contribution.id, {
      id: session.id,
      livemode: session.livemode,
      expiresAt: session.expires_at,
    });

    return NextResponse.json({
      ok: true,
      clientSecret: session.client_secret,
      sessionId: session.id,
    });
  } catch (error) {
    if (error instanceof ContributionAttemptTerminalError) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "That payment attempt is no longer active. Review the amount and continue again to start a new secure payment.",
          retryWithNewAttempt: true,
        },
        { status: 409 },
      );
    }

    if (error instanceof ContributionLimitError) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Campaign records cannot accept this contribution amount under the current online limit. Choose a lower amount or contact the campaign if this appears incorrect.",
          fields: {
            amountCents:
              "Choose an amount within the remaining limit or contact the campaign.",
          },
        },
        { status: 409 },
      );
    }

    if (contributionId) {
      try {
        await markContributionFailed(contributionId);
      } catch (storeError) {
        console.error("Failed to mark contribution attempt as failed.", {
          contributionId,
          error:
            storeError instanceof Error ? storeError.name : "UnknownError",
        });
      }
    }

    console.error("Contribution session creation failed.", {
      contributionId,
      error: error instanceof Error ? error.name : "UnknownError",
      phase,
    });
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
