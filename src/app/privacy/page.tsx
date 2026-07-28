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
              This page describes the intended data flow for the campaign
              website. Final policy language requires campaign and treasurer
              approval before launch.
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
              When online contributions open, the campaign will collect the
              identity, address, occupation, employer, amount, and eligibility
              attestations required for campaign reporting. Stripe will process
              payment details and remain the contribution system of record. Card
              and bank details do not enter the campaign website’s source code,
              logs, or page content.
            </p>
          </section>
          <section>
            <h2>Security and abuse prevention</h2>
            <p>
              The site validates form submissions, checks their origin, uses
              automated-spam controls, and applies rate limits. Campaign forms do
              not intentionally place personal contact or payment information in
              public server logs.
            </p>
          </section>
          <section>
            <h2>Sharing and retention</h2>
            <p>
              Campaign information is intended for campaign operations,
              compliance, and legally required reporting. Final retention,
              disclosure, refund, and deletion language will be approved by the
              campaign’s treasurer before production fundraising begins.
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
          <p className="policy-updated">Draft updated July 27, 2026.</p>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
