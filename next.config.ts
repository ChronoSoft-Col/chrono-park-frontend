import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone", // Necesario para Docker
  images: {
    domains: ["avatars.githubusercontent.com", "*"],
  },
  cacheComponents: false,
};

export default nextConfig;
