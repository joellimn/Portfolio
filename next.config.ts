import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@ashishgogula/coverflow"],
  images: {
    qualities: [75, 95],
  },
  async redirects() {
    return [
      // V4 splits the single page into routes, so Work is the index and About
      // is a real page rather than an anchor.
      { source: "/works", destination: "/", permanent: true },
      { source: "/works/:slug", destination: "/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
