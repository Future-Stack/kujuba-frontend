import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   images: {
    domains: ["api.connecttoinspect.com"],
    // remotePatterns: [
    //   {
    //     protocol: "https",
    //     hostname: "api.connecttoinspect.com",
    //   }
    // ]
  },
};

export default nextConfig;
