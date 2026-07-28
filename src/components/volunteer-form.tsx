"use client";

import { FormEvent, useRef, useState } from "react";
import { campaign } from "@/content/campaign";

const interestOptions = [
  "Canvassing",
  "Phone or text banking",
  "Host a gathering",
  "Yard sign",
  "Election Day",
];
const volunteerSignupEnabled =
  process.env.NEXT_PUBLIC_VOLUNTEER_ENABLED === "true";

type FieldErrors = Record<string, string>;

export function VolunteerForm() {
  const startedAt = useRef(0);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  if (!volunteerSignupEnabled) {
    return (
      <div className="form-success" role="status">
        <p className="section-label">Step up for District 3</p>
        <h3>Volunteer with the campaign.</h3>
        <p>
          Online signup is being connected. Call{" "}
          <a href={`tel:${campaign.phoneHref}`}>{campaign.phoneDisplay}</a> or
          email <a href={`mailto:${campaign.email}`}>{campaign.email}</a> to get
          involved today.
        </p>
      </div>
    );
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const search = new URLSearchParams(window.location.search);
    const payload = {
      name: data.get("name"),
      email: data.get("email"),
      phone: data.get("phone"),
      zip: data.get("zip"),
      interests: data.getAll("interests"),
      message: data.get("message"),
      consent: data.get("consent") === "on",
      website: data.get("website"),
      startedAt: startedAt.current,
      sourcePath: `${window.location.pathname}${window.location.search}`,
      utm: {
        source: search.get("utm_source") ?? undefined,
        medium: search.get("utm_medium") ?? undefined,
        campaign: search.get("utm_campaign") ?? undefined,
        content: search.get("utm_content") ?? undefined,
        term: search.get("utm_term") ?? undefined,
      },
    };

    setStatus("submitting");
    setMessage("");
    setFieldErrors({});

    try {
      const response = await fetch("/api/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        message?: string;
        fields?: FieldErrors;
      };

      if (!response.ok || !result.ok) {
        setStatus("error");
        setMessage(result.message ?? "We could not save your signup.");
        const nextFields = result.fields ?? {};
        setFieldErrors(nextFields);
        requestAnimationFrame(() => {
          const firstField = Object.keys(nextFields).find((key) => key !== "form");
          if (firstField) {
            const element = form.querySelector(`[name="${firstField}"]`);
            if (element instanceof HTMLElement) element.focus();
          }
        });
        return;
      }

      setStatus("success");
      setMessage("Thank you. The campaign received your volunteer signup.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("We could not reach the signup service.");
    }
  }

  if (status === "success") {
    return (
      <div className="form-success" role="status">
        <p className="section-label">You’re in</p>
        <h3>Thank you for stepping up.</h3>
        <p>{message}</p>
      </div>
    );
  }

  return (
    <form
      className="volunteer-form"
      noValidate
      onFocusCapture={() => {
        if (!startedAt.current) startedAt.current = Date.now();
      }}
      onPointerDown={() => {
        if (!startedAt.current) startedAt.current = Date.now();
      }}
      onSubmit={submit}
    >
      <div className="form-grid">
        <Field
          error={fieldErrors.name}
          label="Full name"
          name="name"
          required
        />
        <Field
          error={fieldErrors.email}
          label="Email"
          name="email"
          required
          type="email"
        />
        <Field
          error={fieldErrors.phone}
          label="Phone (optional)"
          name="phone"
          type="tel"
        />
        <Field
          error={fieldErrors.zip}
          inputMode="numeric"
          label="ZIP code"
          maxLength={10}
          name="zip"
          required
        />
      </div>

      <fieldset className="interest-fieldset">
        <legend>How would you like to help?</legend>
        <div className="checkbox-grid">
          {interestOptions.map((option) => (
            <label className="choice" key={option}>
              <input name="interests" type="checkbox" value={option} />
              <span>{option}</span>
            </label>
          ))}
        </div>
        {fieldErrors.interests ? (
          <p className="field-error">{fieldErrors.interests}</p>
        ) : null}
      </fieldset>

      <label className="field">
        <span>Message (optional)</span>
        <textarea maxLength={1_000} name="message" rows={4} />
        {fieldErrors.message ? (
          <span className="field-error">{fieldErrors.message}</span>
        ) : null}
      </label>

      <label className="choice choice-consent">
        <input name="consent" required type="checkbox" />
        <span>
          I agree that the CJ Turrentine campaign may contact me about volunteer
          opportunities.
        </span>
      </label>
      {fieldErrors.consent ? (
        <p className="field-error">{fieldErrors.consent}</p>
      ) : null}

      <label className="honeypot" aria-hidden="true">
        Website
        <input autoComplete="off" name="website" tabIndex={-1} />
      </label>

      {status === "error" || fieldErrors.form ? (
        <div className="form-error" role="alert">
          <p>{fieldErrors.form ?? message}</p>
          <p>
            Call <a href={`tel:${campaign.phoneHref}`}>{campaign.phoneDisplay}</a>{" "}
            or email <a href={`mailto:${campaign.email}`}>{campaign.email}</a>.
          </p>
        </div>
      ) : null}

      <button
        className="button button-gold"
        disabled={status === "submitting"}
        type="submit"
      >
        {status === "submitting" ? "Sending…" : "I’m ready to help"}
      </button>
    </form>
  );
}

type FieldProps = {
  error?: string;
  inputMode?: "numeric";
  label: string;
  maxLength?: number;
  name: string;
  required?: boolean;
  type?: "email" | "tel" | "text";
};

function Field({
  error,
  inputMode,
  label,
  maxLength,
  name,
  required,
  type = "text",
}: FieldProps) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        aria-invalid={Boolean(error)}
        inputMode={inputMode}
        maxLength={maxLength}
        name={name}
        required={required}
        type={type}
      />
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
}
