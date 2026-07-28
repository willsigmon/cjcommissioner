export const DONATION_MIN_CENTS = 500;
export const DONATION_MAX_CENTS = 680_000;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[0-9+().\-\s]{7,24}$/;
const zipPattern = /^\d{5}(?:-\d{4})?$/;
const statePattern = /^[A-Za-z]{2}$/;

type ValidationSuccess<T> = { ok: true; data: T };
type ValidationFailure = {
  ok: false;
  message: string;
  fields: Record<string, string>;
};

export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

export type VolunteerSubmission = {
  name: string;
  email: string;
  phone?: string;
  zip: string;
  interests: string[];
  message?: string;
  consent: true;
  sourcePath: string;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    content?: string;
    term?: string;
  };
  startedAt: number;
  website: string;
};

export type DonationSubmission = {
  fullName: string;
  email: string;
  phone?: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
  };
  occupation: string;
  employer: string;
  amountCents: number;
  attestations: {
    personalFunds: true;
    ownName: true;
    lawfulSource: true;
    limitAcknowledged: true;
  };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength + 1) : "";
}

export function validateVolunteerPayload(
  value: unknown,
  now = Date.now(),
): ValidationResult<VolunteerSubmission> {
  if (!isRecord(value)) {
    return {
      ok: false,
      message: "Check the form and try again.",
      fields: { form: "Invalid submission." },
    };
  }

  const name = text(value.name, 100);
  const email = text(value.email, 160).toLowerCase();
  const phone = text(value.phone, 24);
  const zip = text(value.zip, 10);
  const message = text(value.message, 1_000);
  const sourcePath = text(value.sourcePath, 200) || "/";
  const website = text(value.website, 200);
  const startedAt =
    typeof value.startedAt === "number" && Number.isFinite(value.startedAt)
      ? value.startedAt
      : 0;
  const interests = Array.isArray(value.interests)
    ? value.interests
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim().slice(0, 60))
        .filter(Boolean)
        .slice(0, 8)
    : [];
  const fields: Record<string, string> = {};

  if (name.length < 2 || name.length > 100) {
    fields.name = "Enter your full name.";
  }
  if (!emailPattern.test(email) || email.length > 160) {
    fields.email = "Enter a valid email address.";
  }
  if (phone && !phonePattern.test(phone)) {
    fields.phone = "Enter a valid phone number or leave it blank.";
  }
  if (!zipPattern.test(zip)) {
    fields.zip = "Enter a five-digit ZIP code.";
  }
  if (interests.length === 0) {
    fields.interests = "Choose at least one way to help.";
  }
  if (value.consent !== true) {
    fields.consent = "Please confirm that the campaign may contact you.";
  }
  if (message.length > 1_000) {
    fields.message = "Keep your message under 1,000 characters.";
  }
  if (!sourcePath.startsWith("/") || sourcePath.length > 200) {
    fields.form = "Invalid source path.";
  }
  if (website) {
    fields.form = "Unable to submit this form.";
  }
  if (!startedAt || startedAt > now || now - startedAt < 2_500) {
    fields.form = "Please take a moment to review the form before submitting.";
  }

  if (Object.keys(fields).length > 0) {
    return {
      ok: false,
      message: "Check the highlighted fields and try again.",
      fields,
    };
  }

  const utmValue = isRecord(value.utm) ? value.utm : {};
  const utm = {
    source: text(utmValue.source, 100) || undefined,
    medium: text(utmValue.medium, 100) || undefined,
    campaign: text(utmValue.campaign, 100) || undefined,
    content: text(utmValue.content, 100) || undefined,
    term: text(utmValue.term, 100) || undefined,
  };

  return {
    ok: true,
    data: {
      name,
      email,
      phone: phone || undefined,
      zip,
      interests,
      message: message || undefined,
      consent: true,
      sourcePath,
      utm,
      startedAt,
      website: "",
    },
  };
}

export function validateDonationPayload(
  value: unknown,
): ValidationResult<DonationSubmission> {
  if (!isRecord(value)) {
    return {
      ok: false,
      message: "Check the form and try again.",
      fields: { form: "Invalid submission." },
    };
  }

  const fullName = text(value.fullName, 120);
  const email = text(value.email, 160).toLowerCase();
  const phone = text(value.phone, 24);
  const occupation = text(value.occupation, 120);
  const employer = text(value.employer, 160);
  const addressValue = isRecord(value.address) ? value.address : {};
  const line1 = text(addressValue.line1, 160);
  const line2 = text(addressValue.line2, 160);
  const city = text(addressValue.city, 100);
  const state = text(addressValue.state, 2).toUpperCase();
  const postalCode = text(addressValue.postalCode, 10);
  const amountCents =
    typeof value.amountCents === "number" &&
    Number.isSafeInteger(value.amountCents)
      ? value.amountCents
      : 0;
  const attestationsValue = isRecord(value.attestations)
    ? value.attestations
    : {};
  const fields: Record<string, string> = {};

  if (fullName.length < 2 || fullName.length > 120) {
    fields.fullName = "Enter your full legal name.";
  }
  if (!emailPattern.test(email) || email.length > 160) {
    fields.email = "Enter a valid email address.";
  }
  if (phone && !phonePattern.test(phone)) {
    fields.phone = "Enter a valid phone number or leave it blank.";
  }
  if (!line1) fields.line1 = "Enter your street address.";
  if (!city) fields.city = "Enter your city.";
  if (!statePattern.test(state)) fields.state = "Use a two-letter state code.";
  if (!zipPattern.test(postalCode)) {
    fields.postalCode = "Enter a valid ZIP code.";
  }
  if (!occupation) fields.occupation = "Enter your principal occupation.";
  if (!employer) {
    fields.employer = "Enter your employer, or “Not employed.”";
  }
  if (
    amountCents < DONATION_MIN_CENTS ||
    amountCents > DONATION_MAX_CENTS
  ) {
    fields.amountCents = "Choose an amount from $5 to $6,800.";
  }

  const requiredAttestations = [
    "personalFunds",
    "ownName",
    "lawfulSource",
    "limitAcknowledged",
  ] as const;
  for (const key of requiredAttestations) {
    if (attestationsValue[key] !== true) {
      fields.attestations = "Confirm every eligibility statement to continue.";
      break;
    }
  }

  if (Object.keys(fields).length > 0) {
    return {
      ok: false,
      message: "Check the highlighted fields and try again.",
      fields,
    };
  }

  return {
    ok: true,
    data: {
      fullName,
      email,
      phone: phone || undefined,
      address: {
        line1,
        line2: line2 || undefined,
        city,
        state,
        postalCode,
      },
      occupation,
      employer,
      amountCents,
      attestations: {
        personalFunds: true,
        ownName: true,
        lawfulSource: true,
        limitAcknowledged: true,
      },
    },
  };
}

export function isAllowedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  const allowed = new Set<string>();
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    try {
      allowed.add(new URL(configured).origin);
    } catch {
      return false;
    }
  }

  if (process.env.NODE_ENV !== "production") {
    allowed.add("http://127.0.0.1:3000");
    allowed.add("http://127.0.0.1:3001");
    allowed.add("http://localhost:3000");
    allowed.add("http://localhost:3001");
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) allowed.add(`https://${vercelUrl}`);

  for (const extra of process.env.ALLOWED_ORIGINS?.split(",") ?? []) {
    try {
      allowed.add(new URL(extra.trim()).origin);
    } catch {
      // Ignore malformed optional entries; a value must be an explicit origin.
    }
  }

  return allowed.has(origin);
}
