/* ===========================================================================
   VIDEO EMBED HELPERS
   ---------------------------------------------------------------------------
   Turns a normal share link (the kind you get from "Copy link" on TikTok,
   Instagram or YouTube) into the embed URL each platform needs.

   This exists so that adding a video to src/content/portfolio.ts only ever
   requires pasting a URL — no embed codes, no iframes, no HTML.
   =========================================================================== */

export type Platform = "tiktok" | "instagram" | "youtube" | "unknown";

export const platformLabels: Record<Platform, string> = {
  tiktok: "TikTok",
  instagram: "Instagram Reel",
  youtube: "YouTube Short",
  unknown: "Video",
};

/** Works out which platform a URL belongs to. */
export function getPlatform(url: string): Platform {
  const value = url.toLowerCase();
  if (value.includes("tiktok.com")) return "tiktok";
  if (value.includes("instagram.com")) return "instagram";
  if (value.includes("youtube.com") || value.includes("youtu.be")) return "youtube";
  return "unknown";
}

/**
 * Builds the embeddable iframe URL for a post.
 * Returns null if the link isn't a shape we recognise, in which case the
 * gallery shows a "watch on <platform>" link instead of an embed.
 */
export function getEmbedUrl(url: string): string | null {
  const platform = getPlatform(url);

  switch (platform) {
    /* https://www.tiktok.com/@user/video/1234567890  ->  /embed/v2/1234567890 */
    case "tiktok": {
      const id = url.match(/\/video\/(\d+)/)?.[1] ?? url.match(/tiktok\.com\/embed\/v2\/(\d+)/)?.[1];
      return id ? `https://www.tiktok.com/embed/v2/${id}` : null;
    }

    /* https://www.instagram.com/reel/ABC123/  ->  .../reel/ABC123/embed */
    case "instagram": {
      const match = url.match(/instagram\.com\/(reel|reels|p|tv)\/([A-Za-z0-9_-]+)/);
      if (!match) return null;
      const [, , shortcode] = match;
      return `https://www.instagram.com/reel/${shortcode}/embed`;
    }

    /* Shorts, watch URLs and youtu.be links all map to /embed/<id> */
    case "youtube": {
      const id =
        url.match(/shorts\/([A-Za-z0-9_-]{6,})/)?.[1] ??
        url.match(/[?&]v=([A-Za-z0-9_-]{6,})/)?.[1] ??
        url.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/)?.[1];
      return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0&playsinline=1` : null;
    }

    default:
      return null;
  }
}
