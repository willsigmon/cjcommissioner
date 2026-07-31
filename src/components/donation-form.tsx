"use client";

import { loadStripe } from "@stripe/stripe-js";
import type { StripeExpressCheckoutElementConfirmEvent } from "@stripe/stripe-js";
import {
  CheckoutElementsProvider,
  ExpressCheckoutElement,
  PaymentElement,
  useCheckoutElements,
} from "@stripe/react-stripe-js/checkout";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import {
  DONATION_ELIGIBILITY_ATTESTATION,
  DONATION_REPORTING_DISCLOSURE,
} from "@/lib/donation-policy";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;
const presets = [50, 100, 250, 500] as const;

type DonorDefaults = {
  email: string;
  name: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
  };
};

export function DonationForm({ enabled }: { enabled: boolean }) {
  const [selectedAmount, setSelectedAmount] = useState<number | "other">(100);
  const [otherAmount, setOtherAmount] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [message, setMessage] = useState("");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [clientAttemptId, setClientAttemptId] = useState<string | null>(null);
  const [checkout, setCheckout] = useState<{
    clientSecret: string;
    defaults: DonorDefaults;
  } | null>(null);

  const amountCents = useMemo(() => {
    const amount =
      selectedAmount === "other" ? Number(otherAmount) : selectedAmount;
    return Number.isFinite(amount) ? Math.round(amount * 100) : 0;
  }, [otherAmount, selectedAmount]);

  if (!enabled || !publishableKey) {
    return (
      <div className="setup-notice" role="status">
        <strong>Online contributions are opening soon.</strong>
        <p>
          The campaign is completing its secure payment and treasurer review
          before accepting contributions online. No payment information is
          being collected yet.
        </p>
      </div>
    );
  }

  async function createSession(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const defaults: DonorDefaults = {
      name: String(formData.get("fullName") ?? ""),
      email: String(formData.get("email") ?? ""),
      address: {
        line1: String(formData.get("line1") ?? ""),
        line2: String(formData.get("line2") ?? "") || undefined,
        city: String(formData.get("city") ?? ""),
        state: String(formData.get("state") ?? ""),
        postalCode: String(formData.get("postalCode") ?? ""),
      },
    };
    const attemptId = clientAttemptId ?? crypto.randomUUID();
    if (!clientAttemptId) setClientAttemptId(attemptId);
    const payload = {
      clientAttemptId: attemptId,
      fullName: defaults.name,
      email: defaults.email,
      address: defaults.address,
      occupation: formData.get("occupation"),
      employer: formData.get("employer"),
      amountCents,
      eligibilityConfirmed: formData.get("eligibilityConfirmed") === "on",
    };

    setStatus("submitting");
    setMessage("");
    setFields({});
    try {
      const response = await fetch("/api/donations/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        message?: string;
        fields?: Record<string, string>;
        clientSecret?: string;
      };

      if (!response.ok || !result.ok || !result.clientSecret) {
        setStatus("error");
        setMessage(result.message ?? "The secure payment form is unavailable.");
        setFields(result.fields ?? {});
        return;
      }

      setCheckout({ clientSecret: result.clientSecret, defaults });
      setStatus("idle");
    } catch {
      setStatus("error");
      setMessage("The secure payment form is unavailable.");
    }
  }

  if (checkout && stripePromise) {
    return (
      <CheckoutElementsProvider
        options={{
          clientSecret: checkout.clientSecret,
          defaultValues: {
            email: checkout.defaults.email,
            billingAddress: {
              name: checkout.defaults.name,
              address: {
                country: "US",
                line1: checkout.defaults.address.line1,
                line2: checkout.defaults.address.line2,
                city: checkout.defaults.address.city,
                state: checkout.defaults.address.state,
                postal_code: checkout.defaults.address.postalCode,
              },
            },
          },
          elementsOptions: {
            appearance: {
              theme: "stripe",
              variables: {
                colorPrimary: "#145DA0",
                colorText: "#0E1B2A",
                colorBackground: "#FFFDF7",
                colorDanger: "#B3322A",
                borderRadius: "4px",
                fontFamily: "IBM Plex Sans, sans-serif",
              },
            },
            savedPaymentMethod: {
              enableSave: "never",
              enableRedisplay: "never",
            },
          },
        }}
        stripe={stripePromise}
      >
        <CheckoutPanel amountCents={amountCents} />
      </CheckoutElementsProvider>
    );
  }

  return (
    <form
      className="donation-form"
      noValidate
      onChangeCapture={() => {
        if (status === "error") setClientAttemptId(null);
      }}
      onSubmit={createSession}
    >
      <div className="reporting-disclosure">
        <strong>Required contributor information</strong>
        <p>{DONATION_REPORTING_DISCLOSURE}</p>
        <p>
          All contribution and reporting fields are required. The contribution
          date, amount, and payment method are recorded automatically when the
          payment is completed.
        </p>
      </div>

      <fieldset
        aria-describedby={fields.amountCents ? "amount-error" : undefined}
        className="amount-fieldset"
      >
        <legend>Choose an amount</legend>
        <div className="amount-grid">
          {presets.map((amount) => (
            <label className="amount-choice" key={amount}>
              <input
                checked={selectedAmount === amount}
                name="amount"
                onChange={() => setSelectedAmount(amount)}
                type="radio"
                value={amount}
              />
              <span>${amount}</span>
            </label>
          ))}
          <label className="amount-choice">
            <input
              checked={selectedAmount === "other"}
              name="amount"
              onChange={() => setSelectedAmount("other")}
              type="radio"
              value="other"
            />
            <span>Other</span>
          </label>
        </div>
        {selectedAmount === "other" ? (
          <label className="field other-amount">
            <span>Amount in dollars</span>
            <div className="money-input">
              <span>$</span>
              <input
                inputMode="decimal"
                max={6_800}
                min={5}
                onChange={(event) => setOtherAmount(event.target.value)}
                required
                step="1"
                type="number"
                value={otherAmount}
              />
            </div>
          </label>
        ) : null}
        {fields.amountCents ? (
          <p className="field-error" id="amount-error">
            {fields.amountCents}
          </p>
        ) : null}
      </fieldset>

      <div className="form-section">
        <div className="form-section-heading">
          <span>1</span>
          <h2>Your information</h2>
        </div>
        <p className="form-help">
          North Carolina campaign reporting rules require contributor
          information. It is stored in the campaign&apos;s private contribution
          ledger and is not placed in Stripe metadata.
        </p>
        <div className="form-grid">
          <DonationField error={fields.fullName} label="Full legal name" name="fullName" required />
          <DonationField error={fields.email} label="Email" name="email" required type="email" />
          <DonationField
            error={fields.occupation}
            label="Job title or profession"
            name="occupation"
            required
          />
          <DonationField
            error={fields.employer}
            label="Employer’s name or specified field of business activity"
            name="employer"
            required
          />
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-heading">
          <span>2</span>
          <h2>Mailing address</h2>
        </div>
        <div className="form-grid">
          <DonationField error={fields.line1} label="Street address" name="line1" required />
          <DonationField label="Address line 2 (optional)" name="line2" />
          <DonationField error={fields.city} label="City" name="city" required />
          <DonationField error={fields.state} label="State" maxLength={2} name="state" required />
          <DonationField error={fields.postalCode} label="ZIP code" maxLength={10} name="postalCode" required />
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-heading">
          <span>3</span>
          <h2>Eligibility</h2>
        </div>
        <p className="form-help">
          Confirm the statement before continuing. The campaign treasurer
          reviews every contribution for final compliance.
        </p>
        <div
          aria-describedby={
            fields.eligibilityConfirmed ? "eligibility-error" : undefined
          }
          className="attestations"
          role="group"
        >
          <Attestation name="eligibilityConfirmed">
            {DONATION_ELIGIBILITY_ATTESTATION}
          </Attestation>
        </div>
        {fields.eligibilityConfirmed ? (
          <p className="field-error" id="eligibility-error">
            {fields.eligibilityConfirmed}
          </p>
        ) : null}
      </div>

      {status === "error" ? (
        <div className="form-error" role="alert">
          {message}
        </div>
      ) : null}

      <button
        className="button button-brick button-wide"
        disabled={status === "submitting"}
        type="submit"
      >
        {status === "submitting"
          ? "Opening secure payment…"
          : `Continue with $${(amountCents / 100).toLocaleString()}`}
      </button>
      <p className="secure-note">
        Payment details are handled securely by Stripe. The campaign website
        does not store card or bank details. See the{" "}
        <Link href="/privacy">privacy policy</Link>.
      </p>
    </form>
  );
}

function CheckoutPanel({ amountCents }: { amountCents: number }) {
  const checkoutState = useCheckoutElements();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (checkoutState.type === "loading") {
    return <p className="payment-loading">Loading secure payment options…</p>;
  }
  if (checkoutState.type === "error") {
    return <div className="form-error">{checkoutState.error.message}</div>;
  }

  const { checkout } = checkoutState;
  const returnUrl = `${window.location.origin}/donate/success?session_id={CHECKOUT_SESSION_ID}`;

  async function confirmStandard(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const result = await checkout.confirm({ returnUrl });
    if (result.type === "error") {
      setError(result.error.message);
      setSubmitting(false);
    }
  }

  async function confirmExpress(
    event: StripeExpressCheckoutElementConfirmEvent,
  ) {
    setError("");
    const result = await checkout.confirm({
      returnUrl,
      expressCheckoutConfirmEvent: event,
    });
    if (result.type === "error") setError(result.error.message);
  }

  return (
    <div className="checkout-panel">
      <div className="checkout-summary">
        <span>Contribution</span>
        <strong>${(amountCents / 100).toLocaleString()}</strong>
      </div>
      <ExpressCheckoutElement onConfirm={confirmExpress} />
      <div className="payment-divider">
        <span>or pay with card</span>
      </div>
      <form onSubmit={confirmStandard}>
        <PaymentElement />
        {error ? <div className="form-error">{error}</div> : null}
        <button
          className="button button-brick button-wide"
          disabled={submitting}
          type="submit"
        >
          {submitting ? "Processing…" : "Complete contribution"}
        </button>
      </form>
      <Link className="cancel-link" href="/donate/cancel">
        Cancel and return
      </Link>
    </div>
  );
}

type DonationFieldProps = {
  error?: string;
  label: string;
  maxLength?: number;
  name: string;
  required?: boolean;
  type?: "email" | "tel" | "text";
};

function DonationField({
  error,
  label,
  maxLength,
  name,
  required,
  type = "text",
}: DonationFieldProps) {
  const errorId = `${name}-error`;

  return (
    <label className="field">
      <span>{label}</span>
      <input
        aria-describedby={error ? errorId : undefined}
        aria-invalid={Boolean(error)}
        maxLength={maxLength}
        name={name}
        required={required}
        type={type}
      />
      {error ? (
        <span className="field-error" id={errorId}>
          {error}
        </span>
      ) : null}
    </label>
  );
}

function Attestation({
  children,
  name,
}: {
  children: React.ReactNode;
  name: string;
}) {
  return (
    <label className="choice choice-attestation">
      <input name={name} required type="checkbox" />
      <span>{children}</span>
    </label>
  );
}
