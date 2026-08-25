import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@ashishgogula/coverflow"],
  images: {
    qualities: [75, 95],
  },
  async redirects() {
    return [
      { source: "/works", destination: "/#works", permanent: true },
      { source: "/about", destination: "/#about", permanent: true },
      { source: "/works/:slug", destination: "/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
