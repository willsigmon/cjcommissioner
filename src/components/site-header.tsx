"use client";

import Link from "next/link";
import { useState } from "react";
import { CloseIcon, MenuIcon } from "@/components/icons";

const navigation = [
  { href: "/#results", label: "Results" },
  { href: "/#priorities", label: "Priorities" },
  { href: "/#district", label: "District 3" },
  { href: "/my-story", label: "My Story" },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="wordmark" href="/" aria-label="CJ Turrentine campaign home">
          <span className="wordmark-name">CJ Turrentine</span>
          <span className="wordmark-office">District 3</span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
          <Link className="header-volunteer" href="/#get-involved">
            Volunteer
          </Link>
          <Link className="button button-small button-brick" href="/donate">
            Donate
          </Link>
        </nav>

        <button
          aria-controls="mobile-navigation"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          className="menu-button"
          onClick={() => setIsOpen((value) => !value)}
          type="button"
        >
          {isOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      <nav
        aria-label="Mobile navigation"
        className="mobile-nav"
        hidden={!isOpen}
        id="mobile-navigation"
      >
        <Link href="/" onClick={() => setIsOpen(false)}>Home</Link>
        {navigation.map((item) => (
          <Link href={item.href} key={item.href} onClick={() => setIsOpen(false)}>
            {item.label}
          </Link>
        ))}
        <Link href="/#get-involved" onClick={() => setIsOpen(false)}>Volunteer</Link>
        <Link href="/donate" onClick={() => setIsOpen(false)}>Donate</Link>
      </nav>
    </header>
  );
}
