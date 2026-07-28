import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";
import { PhotoLedger } from "@/components/photo-ledger";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { leadership } from "@/content/campaign";
import { storyPhotos } from "@/content/photos";

export const metadata: Metadata = {
  title: "My Story",
  description:
    "CJ Turrentine shares how military service, recovery, and community work shaped his campaign for Vance County Commissioner.",
};

export default function MyStoryPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="story-hero">
          <div className="shell story-hero-grid">
            <div>
              <p className="section-label section-label-gold">My story</p>
              <h1>Service did not end when I came home.</h1>
              <p className="story-deck">
                My campaign is built on a simple belief: if you have the ability
                to serve, you have a responsibility to show up.
              </p>
            </div>
            <div className="story-portrait">
              <Image
                alt="CJ Turrentine"
                height={720}
                priority
                sizes="(max-width: 767px) 100vw, 38vw"
                src="/photos/public-service.webp"
                width={540}
              />
            </div>
          </div>
        </section>

        <article className="story-body">
          <div className="story-rule">
            <span>01</span>
            <p>Army service</p>
          </div>
          <div className="story-prose">
            <p className="story-lede">
              I served our country in the U.S. Army and the North Carolina
              National Guard, including service in Iraq. I learned that service
              means accepting responsibility for the people beside you and
              continuing the mission even when the work is hard.
            </p>
            <p>
              I also came home carrying combat-related brain injuries. Overcoming
              those injuries became part of my journey. I will not add details
              that do not belong to the public, but I can say what the experience
              clarified for me: time matters, people matter, and a life of
              service cannot stop with one chapter.
            </p>
          </div>

          <div className="story-quote">
            <blockquote>
              “This campaign is built on service, not politics.”
            </blockquote>
          </div>

          <div className="story-rule">
            <span>02</span>
            <p>Coming home</p>
          </div>
          <div className="story-prose">
            <p>
              Recovery strengthened my commitment to Vance County. I wanted my
              neighbors to feel the same discipline, persistence, and care that
              military service demanded of me. That meant doing the work before
              asking for an office.
            </p>
            <p>
              I kept showing up—with young people, neighborhood leaders,
              community partners, and residents working for safer streets and
              stronger places. I have seen what happens when people stop waiting
              for someone else to solve the problem and decide to build together.
            </p>
          </div>

          <div className="story-rule">
            <span>03</span>
            <p>Why I’m running</p>
          </div>
          <div className="story-prose">
            <p>
              I am running for Vance County Commissioner because our community
              has a strong workforce, talented young people, deep roots, and more
              potential than the opportunities in front of us today.
            </p>
            <p>
              I want county leadership that negotiates from strength, protects
              our resources, and measures growth by the value it brings back to
              the people who live here. I want to take the same approach that
              moved local work forward: listen, bring people together, name the
              goal, and stay until the work is done.
            </p>
          </div>
        </article>

        <section className="section story-photo-section">
          <div className="shell">
            <header className="section-header split-header">
              <div>
                <p className="section-label">A life of showing up</p>
                <h2>Service is personal before it is political.</h2>
              </div>
              <p>
                These moments span public service, neighborhood relationships,
                youth encouragement, and the ties that keep CJ grounded in Vance
                County.
              </p>
            </header>
            <PhotoLedger photos={storyPhotos} />
          </div>
        </section>

        <section className="leadership-section">
          <div className="shell leadership-grid">
            <div>
              <p className="section-label section-label-light">Leadership</p>
              <h2>Roles are context. The work is the point.</h2>
              <p>
                These experiences widened CJ&apos;s view of the county and the
                people doing the daily work of serving it.
              </p>
            </div>
            <ol>
              {leadership.map((item, index) => (
                <li key={item}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="story-cta">
          <div className="shell story-cta-inner">
            <div>
              <p className="section-label">The next chapter</p>
              <h2>Help carry the work across District 3.</h2>
            </div>
            <Link className="button button-brick" href="/#get-involved">
              Volunteer
              <ArrowUpRight />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
