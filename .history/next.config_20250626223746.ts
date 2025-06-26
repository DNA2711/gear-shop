import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Ensure proper handling of dynamic routes on Vercel
  serverExternalPackages: ["mysql2"],
};

export default nextConfig;
