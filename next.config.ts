import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kiosk-server-production-e08d.up.railway.app",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
