import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@exploravibe/shared"],
  devIndicators: {
    buildActivity: false,
  },
};

export default nextConfig;
