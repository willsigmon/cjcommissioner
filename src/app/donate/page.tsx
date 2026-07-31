import type { Metadata } from "next";
import { DonationForm } from "@/components/donation-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { donationsAreEnabled } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Donate | CJ Turrentine for Commissioner",
  description:
    "Support CJ Turrentine’s campaign for Vance County Commissioner, District 3.",
};

export default function DonatePage() {
  const donationsEnabled = donationsAreEnabled();

  return (
    <>
      <SiteHeader />
      <main>
        <section className="page-hero donate-hero">
          <div className="shell narrow-shell">
            <p className="section-label">Invest in service</p>
            <h1>Put proof to work.</h1>
            <p className="page-deck">
              Your contribution helps the campaign reach District 3 voters,
              organize volunteers, and keep this community-led effort moving.
            </p>
          </div>
        </section>
        <section className="donate-section">
          <div className="shell donate-layout">
            <aside className="donate-aside">
              <p className="section-label">Before you give</p>
              <h2>Clear. Secure. Accountable.</h2>
              <ul className="check-list">
                <li>One-time individual contributions only</li>
                <li>$5 minimum; up to $6,800 for this election</li>
                <li>No tips or fee-coverage upsells</li>
                <li>Cards and eligible wallets through Stripe</li>
                <li>Contributor details protected for required reporting</li>
              </ul>
              <p className="legal-note">
                {donationsEnabled
                  ? "Campaign records are checked against current online contributions. The treasurer reviews every contribution for final compliance."
                  : "Online contributions remain closed until secure payment setup and final treasurer review are complete."}
              </p>
            </aside>
            <div className="donate-form-wrap">
              <DonationForm enabled={donationsEnabled} />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
