import type { Metadata } from "next";

export const SITE_URL = "https://www.cjcommissioner.com";
export const SITE_NAME = "CJ Turrentine for Commissioner";

export function publicPageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      type: "website",
      images: ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
  };
}
