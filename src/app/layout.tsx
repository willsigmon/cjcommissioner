import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cjcommissioner.com"),
  title: "CJ Turrentine for Vance County Commissioner | District 3",
  description:
    "Charles 'CJ' Turrentine Jr. is running for Vance County Commissioner District 3. A combat veteran and community leader, CJ promises respect, honesty, and real effort. Sign the petition by March 3, 2026.",
  keywords: [
    "CJ Turrentine",
    "Vance County Commissioner",
    "District 3",
    "Sandy Creek",
    "Henderson NC",
    "Vance County",
    "Independent candidate",
    "Pathways 2 Peace",
    "Chestnut Street Park",
  ],
  authors: [{ name: "CJ Turrentine Campaign" }],
  openGraph: {
    title: "CJ Turrentine for Vance County Commissioner | District 3",
    description:
      "A public servant, not a politician. Combat veteran and community builder running to change the narrative for Vance County.",
    url: "https://cjcommissioner.com",
    siteName: "CJ Turrentine for Commissioner",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CJ Turrentine for Vance County Commissioner District 3",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CJ Turrentine for Vance County Commissioner",
    description:
      "A public servant, not a politician. Sign the petition to help CJ get on the ballot.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1e3a5f" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
