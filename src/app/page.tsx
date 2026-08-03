import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckIcon } from "@/components/icons";
import { PhotoLedger } from "@/components/photo-ledger";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { VolunteerForm } from "@/components/volunteer-form";
import {
  campaign,
  priorities,
  proofMetrics,
  resultCases,
} from "@/content/campaign";
import { chestnutStreetParkPhotos, homePhotos } from "@/content/photos";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="home-hero">
          <div className="shell hero-grid">
            <div className="hero-copy">
              <p className="ballot-status">
                <span aria-hidden="true" />
                {campaign.status}
              </p>
              <h1>
                <span className="hero-line">A public servant.</span>
                <span className="hero-line hero-line-editorial">
                  A proven record.
                </span>
              </h1>
              <p className="hero-deck">
                Charles “CJ” Turrentine Jr. is a disabled U.S. Army combat
                veteran, community builder, and proud son of Henderson running
                for Vance County Commissioner, District 3. He is focused on
                expanding opportunity, supporting families, and building a
                safer, stronger Vance County.
              </p>
              <div className="button-row">
                <Link className="button button-brick" href="/my-story">
                  Meet CJ
                  <ArrowUpRight />
                </Link>
                <Link className="button button-outline" href="/#get-involved">
                  Volunteer
                </Link>
              </div>
              <p className="hero-note">
                Rooted in Henderson. Ready to serve District 3.
              </p>
            </div>

            <div className="hero-portrait">
              <div className="portrait-field">
                <span className="portrait-district">District 3</span>
                <span className="portrait-proof">Proof in the work</span>
                <Image
                  alt="CJ Turrentine, candidate for Vance County Commissioner District 3"
                  className="portrait-image"
                  height={900}
                  priority
                  sizes="(max-width: 767px) 100vw, 48vw"
                  src="/photos/formal-portrait.webp"
                  width={675}
                />
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="proof-heading" className="proof-band">
          <div className="shell">
            <div className="proof-heading">
              <p className="section-label section-label-light">The record</p>
              <h2 id="proof-heading">Start with what’s already been done.</h2>
            </div>
            <dl className="proof-grid">
              {proofMetrics.map((metric) => (
                <div key={metric.label}>
                  <dt>{metric.label}</dt>
                  <dd>{metric.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="section results-section" id="results">
          <div className="shell">
            <header className="section-header split-header">
              <div>
                <p className="section-label">Proof in the work</p>
                <h2>Done. Underway. Next.</h2>
              </div>
              <p>
                The campaign is not asking voters to rely on titles. Each result
                starts with an outcome, names the work around it, and shows what
                comes next.
              </p>
            </header>

            <div className="results-list">
              {resultCases.map((result, index) => (
                <article className="result-case" key={result.id}>
                  <div className="result-index">0{index + 1}</div>
                  <div className="result-intro">
                    <p className="case-kicker">{result.kicker}</p>
                    <h3>{result.outcome}</h3>
                    <p>{result.role}</p>
                    <p className="partner-note">{result.partners}</p>
                  </div>
                  <div className="stage-list">
                    <div className="stage stage-done">
                      <span>Done</span>
                      <ul>
                        {result.proof.map((proof) => (
                          <li key={proof}>
                            <CheckIcon />
                            {proof}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="stage stage-underway">
                      <span>Underway</span>
                      <p>{result.next}</p>
                    </div>
                    <div className="stage stage-next">
                      <span>Next</span>
                      <p>
                        Bring the same disciplined, partner-led approach to
                        county government.
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section park-section" id="chestnut-street-park">
          <div className="shell">
            <header className="section-header split-header">
              <div>
                <p className="section-label">Community revitalization</p>
                <h2>Chestnut Street Park is moving forward.</h2>
              </div>
              <p>
                Community-led fundraising exceeded $140,000 in partnership with
                Henderson-Vance Recreation and Parks. Phase one is complete, and
                CJ is continuing to lead the work toward phase two.
              </p>
            </header>
            <PhotoLedger photos={chestnutStreetParkPhotos} />
          </div>
        </section>

        <section className="section field-notes-section" id="in-the-community">
          <div className="shell">
            <header className="section-header split-header">
              <div>
                <p className="section-label">In the community</p>
                <h2>The record is visible.</h2>
              </div>
              <p>
                Leadership is more than a list of affiliations. It is time spent
                with young people, veterans, small businesses, partners, and
                neighbors doing the work together.
              </p>
            </header>
            <PhotoLedger photos={homePhotos} />
          </div>
        </section>

        <section className="section priorities-section" id="priorities">
          <div className="shell">
            <header className="section-header split-header">
              <div>
                <p className="section-label section-label-light">Four priorities</p>
                <h2>Opportunity should reach the people who live here.</h2>
              </div>
              <p>
                Vance County has the people, pride, and workforce to move
                forward. County leadership should make sure growth protects what
                matters and returns value to residents.
              </p>
            </header>
            <div className="priority-grid">
              {priorities.map((priority) => (
                <article key={priority.number}>
                  <span>{priority.number}</span>
                  <h3>{priority.title}</h3>
                  <p>{priority.summary}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section district-section" id="district">
          <div className="shell district-grid">
            <div className="district-copy">
              <p className="section-label">District 3</p>
              <h2>Deep roots. Strong neighbors. Real potential.</h2>
              <p className="district-lead">
                District 3 is more than a number on a map. It is rural roads and
                working families, long-held land and new dreams, churches,
                neighborhoods, small businesses, and people who look out for one
                another.
              </p>
              <p>
                Its potential is already here. The job of a commissioner is to
                listen closely, protect the community’s resources, and help turn
                local strength into opportunity people can see and feel.
              </p>
              <Link className="text-link" href="/my-story">
                Why CJ is running <ArrowUpRight />
              </Link>
            </div>
            <figure className="district-map">
              <Image
                alt="Map of Vance County Commission District 3"
                height={760}
                sizes="(max-width: 767px) 100vw, 44vw"
                src="/district-map.png"
                width={570}
              />
              <figcaption>
                District map shown for campaign orientation. Boundaries must be
                reverified before launch.
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="section volunteer-section" id="get-involved">
          <div className="shell volunteer-grid">
            <div className="volunteer-copy">
              <p className="section-label section-label-gold">Get involved</p>
              <h2>Change happens when neighbors step in.</h2>
              <p>
                Tell us how you would like to help. The campaign will follow up
                with a practical next step.
              </p>
              <div className="volunteer-contact">
                <span>Prefer to talk?</span>
                <a href={`tel:${campaign.phoneHref}`}>{campaign.phoneDisplay}</a>
                <a href={`mailto:${campaign.email}`}>{campaign.email}</a>
              </div>
            </div>
            <VolunteerForm />
          </div>
        </section>

        <section className="donate-rail">
          <div className="shell donate-rail-inner">
            <div>
              <p className="section-label">Build the campaign</p>
              <h2>Ready to invest in the work?</h2>
            </div>
            <Link className="button button-brick" href="/donate">
              Donate securely
              <ArrowUpRight />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
