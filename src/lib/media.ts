/*
 * Public media URLs
 *
 * Supabase public Storage assets do not need the Supabase client library in
 * the browser. Keeping URL construction here gives the portfolio content a
 * single, easy-to-update source for the project URL and bucket name.
 */

const portfolioBucket = "website-videos-public";

/**
 * Builds a public Supabase Storage URL for a portfolio asset.
 *
 * The value is intentionally optional while the project is being configured:
 * cards can render their poster/placeholder without creating a broken request
 * when the project URL has not been added to .env.local yet.
 */
export function getPortfolioVideoUrl(path: string): string | undefined {
  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!projectUrl) return undefined;

  const encodedPath = path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `${projectUrl}/storage/v1/object/public/${portfolioBucket}/${encodedPath}`;
}
