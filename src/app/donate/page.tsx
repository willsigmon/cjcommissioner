import type { Metadata } from "next";
import Image from "next/image";
import { DonationForm } from "@/components/donation-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { campaignMaterials } from "@/content/photos";

export const metadata: Metadata = {
  title: "Donate | CJ Turrentine for Commissioner",
  description:
    "Support CJ Turrentine’s campaign for Vance County Commissioner, District 3.",
};

export default function DonatePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="page-hero donate-hero">
          <div className="shell narrow-shell">
            <p className="section-label">Invest in service</p>
            <h1>Help put proof in the work.</h1>
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
                <li>One-time contributions only</li>
                <li>$5 minimum and $6,800 maximum</li>
                <li>No tips or fee-coverage upsells</li>
                <li>Cards and eligible digital wallets through Stripe</li>
              </ul>
              <p className="legal-note">
                Online contributions will open after secure payment setup and
                final treasurer review are complete.
              </p>
            </aside>
            <div className="donate-form-wrap">
              <DonationForm />
            </div>
          </div>
        </section>
        <section className="section campaign-materials-section">
          <div className="shell">
            <header className="section-header split-header">
              <div>
                <p className="section-label section-label-light">
                  Campaign materials
                </p>
                <h2>Carry the message into District 3.</h2>
              </div>
              <p>
                Sign and shirt concepts supplied by the campaign. They are shown
                here as campaign visuals; availability and ordering have not
                been announced.
              </p>
            </header>
            <div className="materials-grid">
              {campaignMaterials.map((material, index) => (
                <figure
                  className={index === 0 ? "material-sign" : undefined}
                  key={material.src}
                >
                  <div className="material-frame">
                    <Image
                      alt={material.alt}
                      fill
                      sizes={
                        index === 0
                          ? "(max-width: 880px) 100vw, 66vw"
                          : "(max-width: 880px) 100vw, 33vw"
                      }
                      src={material.src}
                    />
                  </div>
                  <figcaption>{material.label}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
