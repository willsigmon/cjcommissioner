import type { Metadata, Viewport } from "next";
import {
  Archivo_Black,
  IBM_Plex_Sans,
  Newsreader,
} from "next/font/google";
import "./globals.css";

const archivoBlack = Archivo_Black({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-display",
  weight: "400",
});

const plexSans = IBM_Plex_Sans({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

const newsreader = Newsreader({
  display: "swap",
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-editorial",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cjcommissioner.com"),
  title: {
    default: "CJ Turrentine for Vance County Commissioner | District 3",
    template: "%s | CJ Turrentine",
  },
  description:
    "U.S. Army combat veteran and community builder CJ Turrentine is on the ballot for Vance County Commissioner District 3 on November 3, 2026.",
  keywords: [
    "CJ Turrentine",
    "Vance County Commissioner",
    "District 3",
    "Henderson North Carolina",
    "Vance County",
  ],
  authors: [{ name: "CJ Turrentine Campaign" }],
  openGraph: {
    title: "A public servant. A proven record.",
    description:
      "Meet CJ Turrentine and see the results behind his campaign for Vance County Commission District 3.",
    url: "https://cjcommissioner.com",
    siteName: "CJ Turrentine for Commissioner",
    locale: "en_US",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "A public servant. A proven record.",
    description:
      "CJ Turrentine is on the ballot for Vance County Commission District 3 on November 3, 2026.",
    images: ["/opengraph-image"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFFDF7",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      className={`${archivoBlack.variable} ${plexSans.variable} ${newsreader.variable}`}
      lang="en"
    >
      <body>{children}</body>
    </html>
  );
}
