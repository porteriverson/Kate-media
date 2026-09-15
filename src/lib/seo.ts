import type { Metadata } from "next";
import { site } from "@/content/site";

/**
 * Builds the per-page SEO metadata (title, description, social share tags).
 *
 * ✏️  To change a page's title or description, edit the `buildMetadata(...)`
 * call at the top of that page file in src/app/.
 */
export function buildMetadata({
  title,
  description,
  path = "/",
}: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const url = `${site.url}${path}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url,
      siteName: site.name,
      locale: "en_US",
      type: "website",
      // TODO: add a share image at /public/images/og-image.jpg (1200x630)
      // and uncomment the lines below so links preview nicely when shared.
      // images: [{ url: `${site.url}/images/og-image.jpg`, width: 1200, height: 630, alt: site.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${site.name}`,
      description,
    },
  };
}
