import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { campaign } from "@/content/campaign";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How the CJ Turrentine campaign website handles information.",
};

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="page-hero">
          <div className="shell narrow-shell">
            <p className="section-label">Privacy</p>
            <h1>Clear about the information you share.</h1>
            <p className="page-deck">
              This page explains what the campaign collects, why it is needed,
              and how payment information is kept separate from campaign
              records.
            </p>
          </div>
        </section>
        <article className="policy-body">
          <section>
            <h2>Volunteer information</h2>
            <p>
              When you volunteer, the campaign collects your name, email,
              optional phone, ZIP code, interests, message, consent, source page,
              and campaign-link parameters. The website sends that information
              to a campaign-controlled Google Sheet so the team can follow up. It
              does not keep a second website database copy.
            </p>
          </section>
          <section>
            <h2>Contribution information</h2>
            <p>
              When you contribute, the campaign collects your identity, contact
              information, mailing address, job title or profession, employer or
              field of business, amount, contribution date, payment method
              category, and eligibility confirmation for campaign reporting and
              compliance. The ledger also records the gross amount and Stripe
              processing fee separately. Stripe receives an opaque contribution
              identifier in metadata, along with the contact and billing details
              needed to process your payment. Card numbers, bank account numbers,
              and wallet credentials are never stored in the campaign ledger,
              website source code, logs, or page content.
            </p>
          </section>
          <section>
            <h2>Security and abuse prevention</h2>
            <p>
              The site validates form submissions, checks their origin, uses
              rate limits, verifies Stripe webhook signatures, and processes
              payment updates idempotently. Campaign forms do not intentionally
              place personal contact or payment information in public server
              logs.
            </p>
          </section>
          <section>
            <h2>Sharing and retention</h2>
            <p>
              Contribution information is used for campaign operations,
              contribution-limit review, legally required reporting, refunds,
              and compliance. Access is limited to authorized campaign personnel
              and service providers supporting those purposes. Records are
              retained as required for campaign finance reporting and applicable
              law.
            </p>
          </section>
          <section>
            <h2>Contribution questions and refunds</h2>
            <p>
              Contact the campaign promptly if a contribution was submitted in
              error, appears unauthorized, or needs review. Refunds are issued
              through Stripe after campaign and treasurer verification and remain
              part of the campaign&apos;s compliance record.
            </p>
          </section>
          <section>
            <h2>Contact</h2>
            <p>
              Questions about this policy can be sent to{" "}
              <a href={`mailto:${campaign.email}`}>{campaign.email}</a> or by
              calling{" "}
              <a href={`tel:${campaign.phoneHref}`}>{campaign.phoneDisplay}</a>.
            </p>
          </section>
          <p className="policy-updated">Updated July 31, 2026.</p>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
