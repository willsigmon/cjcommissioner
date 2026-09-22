import type { MetadataRoute } from "next";
import { SITE_URL } from "../lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // Checkout result pages and API endpoints are not public search destinations.
  return ["", "/my-story", "/donate", "/privacy"].map((path) => ({
    url: `${SITE_URL}${path}`,
  }));
}
