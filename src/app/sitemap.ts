import type { MetadataRoute } from "next";
import { navLinks, site } from "@/content/site";

/* Tells Google which pages exist. Built automatically from the nav links in
   src/content/site.ts — add a page there and it shows up here too. */
export default function sitemap(): MetadataRoute.Sitemap {
  return navLinks.map((link) => ({
    url: `${site.url}${link.href === "/" ? "" : link.href}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: link.href === "/" ? 1 : 0.8,
  }));
}
