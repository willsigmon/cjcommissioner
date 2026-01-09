"use client";

import { useState, useEffect, FormEvent } from "react";
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
  Send: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  ),
  Loader: () => (
    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  ),
};

// Floating Orbs component for Web 3.0 aesthetic
function FloatingOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Primary orb - top right */}
      <div className="orb orb-primary w-[600px] h-[600px] -top-48 -right-48 animate-float-slow" />
      {/* Accent orb - bottom left */}
      <div className="orb orb-accent w-[500px] h-[500px] -bottom-32 -left-32 animate-float-reverse" />
      {/* Success orb - center right */}
      <div className="orb orb-success w-[300px] h-[300px] top-1/2 -right-20 animate-morph" />
      {/* Small accent orb */}
      <div className="orb orb-accent w-[200px] h-[200px] top-1/4 left-1/4 animate-float" />
    </div>
  );
}

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
    <div className="flex gap-3 sm:gap-4 justify-center">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="text-center">
          <div className="glass bg-white/20 text-white text-2xl sm:text-3xl md:text-4xl font-bold px-3 sm:px-4 py-2 sm:py-3 rounded-2xl min-w-[60px] sm:min-w-[70px] animate-countdown">
            {value.toString().padStart(2, "0")}
          </div>
          <div className="text-xs sm:text-sm text-white/70 mt-2 uppercase tracking-wider font-medium">
            {unit}
          </div>
        </div>
      ))}
    </div>
  );
}

// Contact Form component with actual functionality
function ContactForm() {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    interest: 'Signing the petition',
    message: ''
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormState('submitting');

    try {
      // Using Formspree for form handling - free tier
      const response = await fetch('https://formspree.io/f/cturrentinejr@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          interest: formData.interest,
          message: formData.message,
          _subject: `Campaign Contact: ${formData.interest}`,
        }),
      });

      if (response.ok) {
        setFormState('success');
        setFormData({ name: '', email: '', interest: 'Signing the petition', message: '' });
      } else {
        // Fallback to mailto if Formspree fails
        const mailtoLink = `mailto:cturrentinejr@gmail.com?subject=${encodeURIComponent(`Campaign Contact: ${formData.interest}`)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nInterest: ${formData.interest}\n\nMessage:\n${formData.message}`)}`;
        window.location.href = mailtoLink;
        setFormState('success');
      }
    } catch {
      // Fallback to mailto
      const mailtoLink = `mailto:cturrentinejr@gmail.com?subject=${encodeURIComponent(`Campaign Contact: ${formData.interest}`)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nInterest: ${formData.interest}\n\nMessage:\n${formData.message}`)}`;
      window.location.href = mailtoLink;
      setFormState('success');
    }
  };

  if (formState === 'success') {
    return (
      <div className="glass-card rounded-3xl p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-[#10b981] rounded-full flex items-center justify-center text-white">
          <Icons.CheckCircle />
        </div>
        <h3 className="text-2xl font-bold text-[#1e3a5f] dark:text-white mb-2">Message Sent!</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Thank you for reaching out. CJ or his team will get back to you soon.
        </p>
        <button
          onClick={() => setFormState('idle')}
          className="text-[#c9a227] font-bold hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-3xl p-8 shadow-xl">
      <h3 className="text-2xl font-bold text-[#1e3a5f] dark:text-white mb-6">
        Send a Message
      </h3>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="form-input w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white/50 dark:bg-slate-700/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#c9a227] focus:border-transparent backdrop-blur-sm"
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
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="form-input w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white/50 dark:bg-slate-700/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#c9a227] focus:border-transparent backdrop-blur-sm"
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
            value={formData.interest}
            onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
            className="form-input w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white/50 dark:bg-slate-700/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#c9a227] focus:border-transparent backdrop-blur-sm"
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
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="form-input w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white/50 dark:bg-slate-700/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#c9a227] focus:border-transparent resize-none backdrop-blur-sm"
            placeholder="How can CJ help you?"
          />
        </div>
        <button
          type="submit"
          disabled={formState === 'submitting'}
          className="btn-glow w-full bg-gradient-to-r from-[#c9a227] to-[#dbb73a] hover:from-[#dbb73a] hover:to-[#c9a227] text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-[1.02] shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {formState === 'submitting' ? (
            <>
              <Icons.Loader />
              Sending...
            </>
          ) : (
            <>
              Send Message
              <Icons.Send />
            </>
          )}
        </button>
      </form>
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
    <div className="min-h-screen bg-white dark:bg-slate-900 relative">
      {/* Floating Orbs Background */}
      <FloatingOrbs />

      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 grid-pattern pointer-events-none z-0" />

      {/* Skip Link */}
      <a href="#main" className="skip-link">
        Skip to main content
      </a>

      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 glass bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#1e3a5f] to-[#16293d] rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
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
                  className="text-slate-600 dark:text-slate-300 hover:text-[#1e3a5f] dark:hover:text-[#c9a227] font-medium transition-all hover:scale-105"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#petition"
                className="btn-glow bg-gradient-to-r from-[#c9a227] to-[#dbb73a] text-white px-6 py-2.5 rounded-full font-bold transition-all hover:scale-105 shadow-lg"
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
            <nav className="md:hidden py-4 border-t border-slate-200/50 dark:border-slate-700/50">
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
                className="block mt-4 bg-gradient-to-r from-[#c9a227] to-[#dbb73a] text-white text-center px-6 py-3 rounded-full font-bold"
              >
                Sign Petition
              </a>
            </nav>
          )}
        </div>
      </header>

      <main id="main" className="relative z-10">
        {/* Hero Section */}
        <section className="pt-24 md:pt-32 pb-16 md:pb-24 px-4 sm:px-6 lg:px-8 relative overflow-visible">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <div className="space-y-6 text-center lg:text-left animate-fadeInLeft">
                <div className="inline-flex items-center gap-2 px-4 py-2 glass bg-[#1e3a5f]/10 dark:bg-[#1e3a5f]/30 rounded-full border border-[#1e3a5f]/20 dark:border-[#c9a227]/30 text-[#1e3a5f] dark:text-[#c9a227]">
                  <Icons.Flag />
                  <span className="text-sm font-semibold">
                    District 3 • Sandy Creek
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1e3a5f] dark:text-white leading-tight">
                  A Public Servant,{" "}
                  <span className="gradient-text">Not a Politician</span>
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
                    className="btn-glow inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#c9a227] to-[#dbb73a] text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-xl hover:shadow-2xl"
                  >
                    Sign the Petition
                    <Icons.ArrowRight />
                  </a>
                  <a
                    href="#about"
                    className="inline-flex items-center justify-center gap-2 glass border-2 border-[#1e3a5f]/30 dark:border-slate-600 text-[#1e3a5f] dark:text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:bg-[#1e3a5f] hover:text-white hover:border-[#1e3a5f]"
                  >
                    Meet CJ
                  </a>
                </div>
              </div>

              {/* Hero Image - CJ against panel */}
              <div className="flex justify-center animate-fadeInUp lg:pb-0 pb-8">
                <div className="relative hero-image-container">
                  {/* Glow effect behind */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f] to-[#c9a227] rounded-3xl blur-3xl opacity-40 animate-pulse-glow scale-95" style={{ top: '40%' }} />

                  {/* Main container - CJ's bottom aligns with panel bottom */}
                  <div className="relative pt-32 sm:pt-40 md:pt-48">
                    {/* Background panel */}
                    <div className="w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-gradient-to-br from-[#1e3a5f] via-[#1e3a5f] to-[#16293d] rounded-3xl shadow-2xl overflow-hidden">
                      {/* Decorative elements inside panel */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#c9a227] rounded-full blur-2xl" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full blur-xl" />
                      </div>
                      {/* Text inside panel - bottom left */}
                      <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                        <p className="text-xs opacity-70">Vance County</p>
                        <p className="text-base sm:text-lg font-bold">District 3 • Sandy Creek</p>
                      </div>
                    </div>

                    {/* CJ Image - head breaks out well above panel */}
                    <div className="absolute -bottom-12 sm:-bottom-16 md:-bottom-20 left-1/2 -translate-x-1/2 w-80 sm:w-96 md:w-[28rem]">
                      <Image
                        src="/cj-turrentine.png"
                        alt="CJ Turrentine - Candidate for Vance County Commissioner District 3"
                        width={448}
                        height={560}
                        className="object-contain drop-shadow-2xl"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Three Promises Banner */}
        <section className="bg-gradient-to-r from-[#1e3a5f] via-[#1e3a5f] to-[#16293d] py-12 px-4 relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#c9a227]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

          <div className="max-w-7xl mx-auto relative z-10">
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
                  className={`glass bg-white/10 rounded-2xl p-6 text-center card-hover animate-fadeInUp stagger-${i + 1}`}
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#c9a227] to-[#dbb73a] rounded-full flex items-center justify-center text-white shadow-lg">
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
        <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-fadeInUp">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#c9a227]/20 to-[#c9a227]/10 text-[#9a7b1d] dark:text-[#c9a227] rounded-full text-sm font-bold uppercase tracking-wider mb-4 border border-[#c9a227]/20">
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
                <div className="glass-card rounded-2xl p-8 shadow-lg card-hover">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#1e3a5f] to-[#16293d] rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-lg">
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

                <div className="glass-card rounded-2xl p-8 shadow-lg card-hover">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#c9a227] to-[#dbb73a] rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-lg">
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

                <div className="glass-card rounded-2xl p-8 shadow-lg card-hover">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-lg">
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
                <div className="bg-gradient-to-br from-[#1e3a5f] to-[#16293d] rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#c9a227]/20 rounded-full blur-2xl" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl" />

                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 relative z-10">
                    <Icons.Award />
                    Leadership Experience
                  </h3>
                  <ul className="space-y-4 relative z-10">
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
                        <span className="text-[#c9a227]"><Icons.CheckCircle /></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 p-6 glass bg-white/10 rounded-xl relative z-10">
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
        <section id="platform" className="py-20 px-4 sm:px-6 lg:px-8 mesh-gradient">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-fadeInUp">
              <span className="inline-block px-4 py-2 bg-[#1e3a5f]/10 text-[#1e3a5f] dark:text-[#c9a227] rounded-full text-sm font-bold uppercase tracking-wider mb-4 border border-[#1e3a5f]/20">
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
                  gradient: "from-red-500 to-red-600",
                },
                {
                  icon: <Icons.GraduationCap />,
                  title: "Education & Youth",
                  desc: "Investing in young people through mentorship, trades education, and creating safe spaces. Strong families build strong communities.",
                  gradient: "from-[#1e3a5f] to-[#16293d]",
                },
                {
                  icon: <Icons.TrendingUp />,
                  title: "Economic Development",
                  desc: "Being a 'cheerleader' for Vance County—leveraging Tier 1 status to attract businesses, infrastructure, and good jobs.",
                  gradient: "from-[#c9a227] to-[#dbb73a]",
                },
                {
                  icon: <Icons.Home />,
                  title: "Community Revitalization",
                  desc: "Extending the Chestnut Street Park model to other neighborhoods, investing in the places that need it most.",
                  gradient: "from-[#10b981] to-[#059669]",
                },
                {
                  icon: <Icons.Users />,
                  title: "Regional Collaboration",
                  desc: "Working with Franklin, Warren, and Granville counties to bring shared resources and opportunities to our region.",
                  gradient: "from-purple-500 to-purple-600",
                },
                {
                  icon: <Icons.Heart />,
                  title: "Fiscal Responsibility",
                  desc: "Smart investments over big spending—like recommending phased jail renovation instead of a $45M new facility.",
                  gradient: "from-orange-500 to-orange-600",
                },
              ].map((item, i) => (
                <div
                  key={item.title}
                  className="glass-card rounded-2xl p-8 shadow-lg card-3d animate-fadeInUp"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg`}>
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
        <section id="achievements" className="py-20 px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-fadeInUp">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#c9a227]/20 to-[#c9a227]/10 text-[#9a7b1d] dark:text-[#c9a227] rounded-full text-sm font-bold uppercase tracking-wider mb-4 border border-[#c9a227]/20">
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
              <div className="glass-card rounded-3xl overflow-hidden shadow-xl card-hover animate-fadeInLeft">
                <div className="h-48 bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="text-center text-white relative z-10">
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
                      <span className="text-[#10b981] flex-shrink-0"><Icons.CheckCircle /></span>
                      <span>Six new breakaway basketball goals</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#10b981] flex-shrink-0"><Icons.CheckCircle /></span>
                      <span>Two colorful courts representing Henderson & Vance County</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#10b981] flex-shrink-0"><Icons.CheckCircle /></span>
                      <span>Top-5 finalist in national Bobcat contest</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#10b981] flex-shrink-0"><Icons.CheckCircle /></span>
                      <span>Phase 2: Solar canopy, ADA bathrooms coming</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Pathways 2 Peace */}
              <div className="glass-card rounded-3xl overflow-hidden shadow-xl card-hover animate-fadeInUp">
                <div className="h-48 bg-gradient-to-br from-[#1e3a5f] to-[#16293d] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="text-center text-white relative z-10">
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
                      <span className="text-[#1e3a5f] dark:text-[#c9a227] flex-shrink-0"><Icons.CheckCircle /></span>
                      <span>170+ community members at initial listening session</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#1e3a5f] dark:text-[#c9a227] flex-shrink-0"><Icons.CheckCircle /></span>
                      <span>Launched connect-to-henderson.com resource hub</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#1e3a5f] dark:text-[#c9a227] flex-shrink-0"><Icons.CheckCircle /></span>
                      <span>Partnership with NC Office of Violence Prevention</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#1e3a5f] dark:text-[#c9a227] flex-shrink-0"><Icons.CheckCircle /></span>
                      <span>Creating practical solutions, not just talk</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Hope House */}
              <div className="glass-card rounded-3xl overflow-hidden shadow-xl card-hover animate-fadeInUp">
                <div className="h-48 bg-gradient-to-br from-[#c9a227] to-[#a07d1a] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="text-center text-white relative z-10">
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
                      <span className="text-[#c9a227] flex-shrink-0"><Icons.CheckCircle /></span>
                      <span>Bridge from shelter to independence</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#c9a227] flex-shrink-0"><Icons.CheckCircle /></span>
                      <span>Financial literacy training</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#c9a227] flex-shrink-0"><Icons.CheckCircle /></span>
                      <span>Life skills development</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* District 3 Context */}
              <div className="bg-gradient-to-br from-[#1e3a5f] to-[#16293d] rounded-3xl overflow-hidden shadow-xl card-hover animate-fadeInUp p-8 text-white relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#c9a227]/20 rounded-full blur-2xl" />
                <h3 className="text-2xl font-bold mb-4 relative z-10">
                  About District 3 (Sandy Creek)
                </h3>
                <p className="text-white/80 mb-6 relative z-10">
                  District 3 covers rural eastern Vance County with 5,732 residents. It&apos;s one of the county&apos;s
                  most diverse districts: 43.8% white, 41.3% Black, and 13.6% Hispanic.
                </p>
                <div className="glass bg-white/10 rounded-2xl p-6 relative z-10">
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
        <section id="petition" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#1e3a5f] via-[#1e3a5f] to-[#16293d] relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#c9a227]/10 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl animate-float-reverse" />

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="animate-fadeInUp">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#c9a227] to-[#dbb73a] text-white rounded-full text-sm font-bold uppercase tracking-wider mb-6 shadow-lg">
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
              <div className="glass bg-white/10 rounded-3xl p-8 mb-8">
                <p className="text-white/80 mb-6 font-medium">Time remaining to submit signatures:</p>
                <Countdown />
              </div>

              <div className="glass-card bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 text-left">
                <h3 className="text-2xl font-bold text-[#1e3a5f] dark:text-white mb-6 text-center">
                  How to Sign the Petition
                </h3>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h4 className="font-bold text-[#1e3a5f] dark:text-white mb-3">Who Can Sign?</h4>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                      <li className="flex items-start gap-2">
                        <span className="text-[#10b981] flex-shrink-0 mt-0.5"><Icons.CheckCircle /></span>
                        <span>Registered voters in District 3</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#10b981] flex-shrink-0 mt-0.5"><Icons.CheckCircle /></span>
                        <span>Any party affiliation—Democrat, Republican, or Unaffiliated</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#10b981] flex-shrink-0 mt-0.5"><Icons.CheckCircle /></span>
                        <span>Must sign in person with original signature</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1e3a5f] dark:text-white mb-3">Where to Sign?</h4>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                      <li className="flex items-start gap-2">
                        <span className="text-[#1e3a5f] dark:text-[#c9a227] flex-shrink-0 mt-0.5"><Icons.MapPin /></span>
                        <span>Exquizid Cuts Barbershop, South Garnett Street</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#c9a227] flex-shrink-0 mt-0.5"><Icons.Calendar /></span>
                        <span>Community events throughout District 3</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#10b981] flex-shrink-0 mt-0.5"><Icons.Phone /></span>
                        <span>Contact CJ to arrange a signing</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="text-center">
                  <a
                    href="#contact"
                    className="btn-glow inline-flex items-center gap-2 bg-gradient-to-r from-[#c9a227] to-[#dbb73a] text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-xl"
                  >
                    Contact CJ to Sign
                    <Icons.ArrowRight />
                  </a>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
                    Every signature counts. Help change the narrative for Vance County.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="py-16 px-4 relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center animate-fadeInUp relative z-10">
            <div className="text-6xl text-[#c9a227] mb-6 opacity-50">&ldquo;</div>
            <blockquote className="text-2xl md:text-3xl font-medium text-[#1e3a5f] dark:text-white mb-6 italic">
              I may not have all the answers, but I pledge to lead with integrity and always put people first.
            </blockquote>
            <cite className="text-slate-600 dark:text-slate-400 not-italic font-bold">
              — CJ Turrentine
            </cite>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 mesh-gradient relative">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="animate-fadeInLeft">
                <span className="inline-block px-4 py-2 bg-[#1e3a5f]/10 text-[#1e3a5f] dark:text-[#c9a227] rounded-full text-sm font-bold uppercase tracking-wider mb-4 border border-[#1e3a5f]/20">
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
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#1e3a5f] to-[#16293d] rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                      <Icons.Phone />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Phone</p>
                      <a href="tel:+12522049334" className="text-lg font-bold text-[#1e3a5f] dark:text-white hover:text-[#c9a227] transition-colors">
                        (252) 204-9334
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#c9a227] to-[#dbb73a] rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                      <Icons.Mail />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
                      <a href="mailto:cturrentinejr@gmail.com" className="text-lg font-bold text-[#1e3a5f] dark:text-white hover:text-[#c9a227] transition-colors">
                        cturrentinejr@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
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
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-[#1e3a5f] to-[#0f172a] text-white py-12 px-4 relative overflow-hidden">
        {/* Decorative element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#c9a227]/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
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
                <li><a href="#about" className="hover:text-[#c9a227] transition-colors">About CJ</a></li>
                <li><a href="#platform" className="hover:text-[#c9a227] transition-colors">Platform</a></li>
                <li><a href="#achievements" className="hover:text-[#c9a227] transition-colors">Achievements</a></li>
                <li><a href="#petition" className="hover:text-[#c9a227] transition-colors">Sign Petition</a></li>
                <li><a href="#contact" className="hover:text-[#c9a227] transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-white/70">
                <li>
                  <a href="tel:+12522049334" className="hover:text-[#c9a227] transition-colors">(252) 204-9334</a>
                </li>
                <li>
                  <a href="mailto:cturrentinejr@gmail.com" className="hover:text-[#c9a227] transition-colors">cturrentinejr@gmail.com</a>
                </li>
                <li>Henderson, NC 27537</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Website By</h4>
              <a
                href="https://willsigmon.media"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white/70 hover:text-[#c9a227] transition-colors group"
              >
                <span className="font-medium">Will Sigmon Media Co.</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <p className="text-white/50 text-sm mt-2">
                Digital strategy & web development
              </p>
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
