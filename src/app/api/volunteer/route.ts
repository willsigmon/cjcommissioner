import { checkRateLimit } from "@vercel/firewall";
import { NextResponse } from "next/server";
import { appendVolunteer } from "@/lib/google-sheets";
import { isAllowedOrigin, validateVolunteerPayload } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json(
      { ok: false, message: "This submission could not be verified." },
      { status: 403 },
    );
  }

  const rateLimitId = process.env.VERCEL_VOLUNTEER_RATE_LIMIT_ID?.trim();
  if (rateLimitId) {
    const result = await checkRateLimit(rateLimitId, { request });
    if (result.rateLimited) {
      return NextResponse.json(
        {
          ok: false,
          message: "Too many attempts. Please wait ten minutes and try again.",
        },
        { status: 429 },
      );
    }
    if (result.error && process.env.NODE_ENV === "production") {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Volunteer signup is temporarily unavailable. Please use the phone or email below.",
        },
        { status: 503 },
      );
    }
  } else if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Volunteer signup is temporarily unavailable. Please use the phone or email below.",
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

  const validated = validateVolunteerPayload(payload);
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
    await appendVolunteer(validated.data);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message:
          "We could not save your signup. Please call or email the campaign so we do not miss you.",
      },
      { status: 503 },
    );
  }
}
