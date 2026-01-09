"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// Icons as simple SVG components
const Icons = {
  Menu: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  X: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Shield: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  GraduationCap: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
  ),
  TrendingUp: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  Users: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Heart: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  Star: () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  CheckCircle: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  ),
  MapPin: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Phone: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  Mail: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Calendar: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  ArrowRight: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  ),
  Flag: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
    </svg>
  ),
  Home: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Award: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
};

// Countdown component
function Countdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const deadline = new Date("2026-03-03T12:00:00-05:00").getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = deadline - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-4 justify-center">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="text-center">
          <div className="bg-[#1e3a5f] text-white text-3xl md:text-4xl font-bold px-4 py-3 rounded-xl min-w-[70px] animate-countdown">
            {value.toString().padStart(2, "0")}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400 mt-2 uppercase tracking-wider font-medium">
            {unit}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "#about", label: "About CJ" },
    { href: "#platform", label: "Platform" },
    { href: "#achievements", label: "Achievements" },
    { href: "#petition", label: "Sign Petition" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Skip Link */}
      <a href="#main" className="skip-link">
        Skip to main content
      </a>

      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-[#1e3a5f] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg md:text-xl">CJ</span>
              </div>
              <div className="hidden sm:block">
                <div className="font-bold text-[#1e3a5f] dark:text-white text-lg">CJ Turrentine</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">For Commissioner</div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-slate-600 dark:text-slate-300 hover:text-[#1e3a5f] dark:hover:text-[#c9a227] font-medium transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#petition"
                className="bg-[#c9a227] hover:bg-[#dbb73a] text-white px-6 py-2.5 rounded-full font-bold transition-all hover:scale-105"
              >
                Sign Now
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-300"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <Icons.X /> : <Icons.Menu />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 border-t border-slate-200 dark:border-slate-700">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 text-slate-600 dark:text-slate-300 hover:text-[#1e3a5f] font-medium"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#petition"
                onClick={() => setMobileMenuOpen(false)}
                className="block mt-4 bg-[#c9a227] text-white text-center px-6 py-3 rounded-full font-bold"
              >
                Sign Petition
              </a>
            </nav>
          )}
        </div>
      </header>

      <main id="main">
        {/* Hero Section */}
        <section className="pt-24 md:pt-32 pb-16 md:pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute top-20 right-0 w-96 h-96 bg-[#1e3a5f] rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-20" />
          <div className="absolute bottom-20 left-0 w-96 h-96 bg-[#c9a227] rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-20" />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <div className="space-y-6 text-center lg:text-left animate-fadeInLeft">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1e3a5f]/10 dark:bg-[#1e3a5f]/30 rounded-full border border-[#1e3a5f]/20">
                  <Icons.Flag />
                  <span className="text-sm font-semibold text-[#1e3a5f] dark:text-[#c9a227]">
                    District 3 • Sandy Creek
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1e3a5f] dark:text-white leading-tight">
                  A Public Servant,{" "}
                  <span className="text-[#c9a227]">Not a Politician</span>
                </h1>

                <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 font-medium">
                  &ldquo;I want to see my community win.&rdquo;
                </p>

                <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto lg:mx-0">
                  Combat veteran. Community builder. Independent thinker. CJ Turrentine is running for Vance County
                  Commissioner to bring leadership rooted in service, not politics.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                  <a
                    href="#petition"
                    className="inline-flex items-center justify-center gap-2 bg-[#c9a227] hover:bg-[#dbb73a] text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Sign the Petition
                    <Icons.ArrowRight />
                  </a>
                  <a
                    href="#about"
                    className="inline-flex items-center justify-center gap-2 border-2 border-[#1e3a5f] dark:border-slate-600 text-[#1e3a5f] dark:text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:bg-[#1e3a5f] hover:text-white"
                  >
                    Meet CJ
                  </a>
                </div>
              </div>

              {/* Hero Image Placeholder */}
              <div className="flex justify-center animate-fadeInUp">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f] to-[#c9a227] rounded-3xl blur-2xl opacity-30 animate-pulse-glow" />
                  <div className="relative w-80 h-96 md:w-96 md:h-[480px] bg-gradient-to-br from-[#1e3a5f] to-[#16293d] rounded-3xl flex items-center justify-center overflow-hidden border-4 border-white dark:border-slate-700 shadow-2xl">
                    <div className="text-center p-8">
                      <div className="w-32 h-32 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-6xl font-bold text-white">CJ</span>
                      </div>
                      <p className="text-white/80 text-lg font-medium">CJ Turrentine</p>
                      <p className="text-[#c9a227] font-bold mt-2">For District 3</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Three Promises Banner */}
        <section className="bg-[#1e3a5f] py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-center text-white text-2xl md:text-3xl font-bold mb-8">
              Three Promises to District 3
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "Respect", desc: "Treating everyone with dignity—even those I disagree with" },
                { title: "Honesty", desc: "Speaking truth and leading with integrity, always" },
                { title: "Real Effort", desc: "Showing up consistently and putting people first" },
              ].map((promise, i) => (
                <div
                  key={promise.title}
                  className={`bg-white/10 backdrop-blur rounded-2xl p-6 text-center animate-fadeInUp stagger-${i + 1}`}
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-[#c9a227] rounded-full flex items-center justify-center">
                    <Icons.CheckCircle />
                  </div>
                  <h3 className="text-white text-xl font-bold mb-2">{promise.title}</h3>
                  <p className="text-white/80">{promise.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-800/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-fadeInUp">
              <span className="inline-block px-4 py-2 bg-[#c9a227]/10 text-[#c9a227] rounded-full text-sm font-bold uppercase tracking-wider mb-4">
                About CJ
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] dark:text-white mb-4">
                Leadership Rooted in Service
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                From serving in Iraq to serving Henderson, CJ brings the discipline and heart
                to make real change in Vance County.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 animate-fadeInLeft">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg card-hover">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#1e3a5f] rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icons.Flag />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#1e3a5f] dark:text-white mb-2">
                        Combat Veteran
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        Served in Iraq during Operation Iraqi Freedom as an infantry dismount team leader
                        and assistant Bradley Fighting Vehicle gunner with the U.S. Army and NC National Guard.
                        &ldquo;If I can serve America in the military, I can definitely serve my community here.&rdquo;
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg card-hover">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#c9a227] rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icons.Heart />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#1e3a5f] dark:text-white mb-2">
                        Faith-Driven Values
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        A lifelong Henderson resident and Davis Chapel member, CJ&apos;s leadership is grounded in
                        grace, compassion, and &ldquo;loving your neighbor.&rdquo; These values guide every decision he makes.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg card-hover">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#10b981] rounded-xl flex items-center justify-center flex-shrink-0 text-white">
                      <Icons.Users />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#1e3a5f] dark:text-white mb-2">
                        Independent Thinker
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        CJ runs as an independent because he believes in holding his ground and bringing
                        &ldquo;a ray of sunshine&rdquo; to effect real change—not playing partisan politics.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="animate-fadeInUp">
                <div className="bg-gradient-to-br from-[#1e3a5f] to-[#16293d] rounded-3xl p-8 md:p-12 text-white">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <Icons.Award />
                    Leadership Experience
                  </h3>
                  <ul className="space-y-4">
                    {[
                      "Chair, Henderson Community-Wide Advisory Committee",
                      "Vance Charter School Board of Directors",
                      "Director, Community Partners of Hope Men's Shelter (5 years)",
                      "Henderson-Vance Crime Stoppers Board Member",
                      "Leadership Vance Class of 2025 Graduate",
                      "Owner, Exquizid Cuts Barbershop (since 2010)",
                      "Sam Watkins Visionary Award Recipient (2025)",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Icons.CheckCircle />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 p-6 bg-white/10 rounded-xl">
                    <p className="italic text-white/90">
                      &ldquo;Most Likely to Be an Elected Official&rdquo;
                    </p>
                    <p className="text-sm text-white/70 mt-2">
                      — Voted by Leadership Vance classmates
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Section */}
        <section id="platform" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-fadeInUp">
              <span className="inline-block px-4 py-2 bg-[#1e3a5f]/10 text-[#1e3a5f] dark:text-[#c9a227] rounded-full text-sm font-bold uppercase tracking-wider mb-4">
                The Platform
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] dark:text-white mb-4">
                Changing the Narrative
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                Vance County has been labeled &ldquo;Tier 1&rdquo; for over 30 years. It&apos;s time for a champion
                who will fight for our future.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Icons.Shield />,
                  title: "Public Safety First",
                  desc: "As the #1 priority, CJ will build on his Pathways 2 Peace work to address gun violence and make our streets safer for families.",
                  color: "bg-red-500",
                },
                {
                  icon: <Icons.GraduationCap />,
                  title: "Education & Youth",
                  desc: "Investing in young people through mentorship, trades education, and creating safe spaces. Strong families build strong communities.",
                  color: "bg-[#1e3a5f]",
                },
                {
                  icon: <Icons.TrendingUp />,
                  title: "Economic Development",
                  desc: "Being a 'cheerleader' for Vance County—leveraging Tier 1 status to attract businesses, infrastructure, and good jobs.",
                  color: "bg-[#c9a227]",
                },
                {
                  icon: <Icons.Home />,
                  title: "Community Revitalization",
                  desc: "Extending the Chestnut Street Park model to other neighborhoods, investing in the places that need it most.",
                  color: "bg-[#10b981]",
                },
                {
                  icon: <Icons.Users />,
                  title: "Regional Collaboration",
                  desc: "Working with Franklin, Warren, and Granville counties to bring shared resources and opportunities to our region.",
                  color: "bg-purple-500",
                },
                {
                  icon: <Icons.Heart />,
                  title: "Fiscal Responsibility",
                  desc: "Smart investments over big spending—like recommending phased jail renovation instead of a $45M new facility.",
                  color: "bg-orange-500",
                },
              ].map((item, i) => (
                <div
                  key={item.title}
                  className={`bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg card-hover animate-fadeInUp`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center text-white mb-6`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[#1e3a5f] dark:text-white mb-3">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section id="achievements" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-800/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-fadeInUp">
              <span className="inline-block px-4 py-2 bg-[#c9a227]/10 text-[#c9a227] rounded-full text-sm font-bold uppercase tracking-wider mb-4">
                Proven Results
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] dark:text-white mb-4">
                Track Record of Impact
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                CJ doesn&apos;t just talk—he delivers. Here&apos;s what he&apos;s already accomplished for Henderson.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Chestnut Street Park */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-xl card-hover animate-fadeInLeft">
                <div className="h-48 bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-5xl font-black">$140K</div>
                    <div className="text-lg mt-2">Raised for Community</div>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-[#1e3a5f] dark:text-white mb-4">
                    Chestnut Street Park Beautification
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    An 8-year effort that transformed a neglected basketball court into a vibrant community space.
                    The park sits on historically significant ground—the old J.P. Taylor tobacco barn site and near
                    Davis Chapel, a Green Book safe haven.
                  </p>
                  <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                    <li className="flex items-center gap-2">
                      <Icons.CheckCircle />
                      <span>Six new breakaway basketball goals</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Icons.CheckCircle />
                      <span>Two colorful courts representing Henderson & Vance County</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Icons.CheckCircle />
                      <span>Top-5 finalist in national Bobcat contest</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Icons.CheckCircle />
                      <span>Phase 2: Solar canopy, ADA bathrooms coming</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Pathways 2 Peace */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-xl card-hover animate-fadeInUp">
                <div className="h-48 bg-gradient-to-br from-[#1e3a5f] to-[#16293d] flex items-center justify-center">
                  <div className="text-center text-white">
                    <Icons.Shield />
                    <div className="text-3xl font-black mt-4">Pathways 2 Peace</div>
                    <div className="text-lg mt-2">501(c)(3) Coalition</div>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-[#1e3a5f] dark:text-white mb-4">
                    Fighting Gun Violence Head-On
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Founded in response to alarming statistics—Vance County has NC&apos;s highest rate of firearm ER visits.
                    CJ built a coalition bringing together community, faith leaders, and local government.
                  </p>
                  <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                    <li className="flex items-center gap-2">
                      <Icons.CheckCircle />
                      <span>170+ community members at initial listening session</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Icons.CheckCircle />
                      <span>Launched connect-to-henderson.com resource hub</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Icons.CheckCircle />
                      <span>Partnership with NC Office of Violence Prevention</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Icons.CheckCircle />
                      <span>Creating practical solutions, not just talk</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Hope House */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-xl card-hover animate-fadeInUp">
                <div className="h-48 bg-gradient-to-br from-[#c9a227] to-[#a07d1a] flex items-center justify-center">
                  <div className="text-center text-white">
                    <Icons.Home />
                    <div className="text-3xl font-black mt-4">The Hope House</div>
                    <div className="text-lg mt-2">Transitional Housing</div>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-[#1e3a5f] dark:text-white mb-4">
                    Helping Men Rebuild Their Lives
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    After 5 years leading the Men&apos;s Homeless Shelter, CJ helped develop The Hope House on
                    Horner Street—a transitional home where men learn financial management and gain self-sufficiency.
                  </p>
                  <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                    <li className="flex items-center gap-2">
                      <Icons.CheckCircle />
                      <span>Bridge from shelter to independence</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Icons.CheckCircle />
                      <span>Financial literacy training</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Icons.CheckCircle />
                      <span>Life skills development</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* District 3 Context */}
              <div className="bg-gradient-to-br from-[#1e3a5f] to-[#16293d] rounded-3xl overflow-hidden shadow-xl card-hover animate-fadeInUp p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">
                  About District 3 (Sandy Creek)
                </h3>
                <p className="text-white/80 mb-6">
                  District 3 covers rural eastern Vance County with 5,732 residents. It&apos;s one of the county&apos;s
                  most diverse districts: 43.8% white, 41.3% Black, and 13.6% Hispanic.
                </p>
                <div className="bg-white/10 rounded-2xl p-6">
                  <p className="text-lg font-medium mb-4">
                    The 2022 primary was decided by just <span className="text-[#c9a227] font-bold">10 votes</span>.
                    Your signature—and your vote—truly matters.
                  </p>
                  <p className="text-white/70 text-sm">
                    The current commissioner was appointed in January 2025, not elected. This is your chance
                    to choose your own representative.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Petition Section */}
        <section id="petition" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#1e3a5f] to-[#16293d]">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-fadeInUp">
              <span className="inline-block px-4 py-2 bg-[#c9a227] text-white rounded-full text-sm font-bold uppercase tracking-wider mb-6">
                Urgent: Deadline Approaching
              </span>

              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Help CJ Get on the Ballot
              </h2>

              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                As an independent candidate, CJ needs petition signatures from registered voters in District 3
                to earn ballot access. The deadline is <strong>noon on March 3, 2026</strong>.
              </p>

              {/* Countdown */}
              <div className="bg-white/10 backdrop-blur rounded-3xl p-8 mb-8">
                <p className="text-white/80 mb-6 font-medium">Time remaining to submit signatures:</p>
                <Countdown />
              </div>

              <div className="bg-white rounded-3xl p-8 md:p-12 text-left">
                <h3 className="text-2xl font-bold text-[#1e3a5f] mb-6 text-center">
                  How to Sign the Petition
                </h3>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h4 className="font-bold text-[#1e3a5f] mb-3">Who Can Sign?</h4>
                    <ul className="space-y-2 text-slate-600">
                      <li className="flex items-start gap-2">
                        <Icons.CheckCircle />
                        <span>Registered voters in District 3</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Icons.CheckCircle />
                        <span>Any party affiliation—Democrat, Republican, or Unaffiliated</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Icons.CheckCircle />
                        <span>Must sign in person with original signature</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1e3a5f] mb-3">Where to Sign?</h4>
                    <ul className="space-y-2 text-slate-600">
                      <li className="flex items-start gap-2">
                        <Icons.MapPin />
                        <span>Exquizid Cuts Barbershop, South Garnett Street</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Icons.Calendar />
                        <span>Community events throughout District 3</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Icons.Phone />
                        <span>Contact CJ to arrange a signing</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="text-center">
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 bg-[#c9a227] hover:bg-[#dbb73a] text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-lg"
                  >
                    Contact CJ to Sign
                    <Icons.ArrowRight />
                  </a>
                  <p className="text-sm text-slate-500 mt-4">
                    Every signature counts. Help change the narrative for Vance County.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="py-16 px-4 bg-white dark:bg-slate-900">
          <div className="max-w-4xl mx-auto text-center animate-fadeInUp">
            <div className="text-5xl text-[#c9a227] mb-6">&ldquo;</div>
            <blockquote className="text-2xl md:text-3xl font-medium text-[#1e3a5f] dark:text-white mb-6 italic">
              I may not have all the answers, but I pledge to lead with integrity and always put people first.
            </blockquote>
            <cite className="text-slate-600 dark:text-slate-400 not-italic">
              — CJ Turrentine
            </cite>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-800/50">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="animate-fadeInLeft">
                <span className="inline-block px-4 py-2 bg-[#1e3a5f]/10 text-[#1e3a5f] dark:text-[#c9a227] rounded-full text-sm font-bold uppercase tracking-wider mb-4">
                  Get Involved
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] dark:text-white mb-6">
                  Join the Movement
                </h2>
                <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
                  Collectively, we will change the narrative. Whether you want to sign the petition,
                  volunteer, or just learn more—CJ wants to hear from you.
                </p>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#1e3a5f] rounded-xl flex items-center justify-center text-white">
                      <Icons.Phone />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Phone</p>
                      <a href="tel:+12522049334" className="text-lg font-bold text-[#1e3a5f] dark:text-white hover:text-[#c9a227]">
                        (252) 204-9334
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#c9a227] rounded-xl flex items-center justify-center text-white">
                      <Icons.Mail />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
                      <a href="mailto:cturrentinejr@gmail.com" className="text-lg font-bold text-[#1e3a5f] dark:text-white hover:text-[#c9a227]">
                        cturrentinejr@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#10b981] rounded-xl flex items-center justify-center text-white">
                      <Icons.MapPin />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Location</p>
                      <p className="text-lg font-bold text-[#1e3a5f] dark:text-white">
                        1110 Carey Chapel Road, Henderson, NC 27537
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="animate-fadeInUp">
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl">
                  <h3 className="text-2xl font-bold text-[#1e3a5f] dark:text-white mb-6">
                    Send a Message
                  </h3>
                  <form className="space-y-6" action={`mailto:cturrentinejr@gmail.com`} method="post" encType="text/plain">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#c9a227] focus:border-transparent"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#c9a227] focus:border-transparent"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="interest" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        I&apos;m Interested In
                      </label>
                      <select
                        id="interest"
                        name="interest"
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#c9a227] focus:border-transparent"
                      >
                        <option>Signing the petition</option>
                        <option>Volunteering</option>
                        <option>Hosting a petition signing event</option>
                        <option>Making a donation</option>
                        <option>General inquiry</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#c9a227] focus:border-transparent resize-none"
                        placeholder="How can CJ help you?"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#c9a227] hover:bg-[#dbb73a] text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-lg"
                    >
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#1e3a5f] text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <span className="text-[#1e3a5f] font-bold text-xl">CJ</span>
                </div>
                <div>
                  <div className="font-bold text-lg">CJ Turrentine</div>
                  <div className="text-white/70 text-sm">For District 3 Commissioner</div>
                </div>
              </div>
              <p className="text-white/70">
                A public servant, not a politician. Changing the narrative for Vance County.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#about" className="hover:text-[#c9a227]">About CJ</a></li>
                <li><a href="#platform" className="hover:text-[#c9a227]">Platform</a></li>
                <li><a href="#achievements" className="hover:text-[#c9a227]">Achievements</a></li>
                <li><a href="#petition" className="hover:text-[#c9a227]">Sign Petition</a></li>
                <li><a href="#contact" className="hover:text-[#c9a227]">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-white/70">
                <li>
                  <a href="tel:+12522049334" className="hover:text-[#c9a227]">(252) 204-9334</a>
                </li>
                <li>
                  <a href="mailto:cturrentinejr@gmail.com" className="hover:text-[#c9a227]">cturrentinejr@gmail.com</a>
                </li>
                <li>Henderson, NC 27537</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 text-center text-white/60 text-sm">
            <p>Paid for by CJ Turrentine for Commissioner</p>
            <p className="mt-2">&copy; {new Date().getFullYear()} CJ Turrentine Campaign. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
