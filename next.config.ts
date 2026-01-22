import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "api-s3-gr15.lexlink.se",
        protocol: "https",
      },
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
