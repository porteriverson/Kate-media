import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Images are served from /public, so no remote image domains are needed yet.
  // If videos/photos ever get hosted somewhere else (e.g. a CDN), add the
  // hostname under images.remotePatterns here.
};

export default nextConfig;
