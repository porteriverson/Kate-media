import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/* Lets search engines crawl the whole site and points them at the sitemap. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
