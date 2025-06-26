import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Ensure proper handling of dynamic routes on Vercel
  serverExternalPackages: ["mysql2"],
  
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Content-Type",
            value: "application/json; charset=utf-8",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
