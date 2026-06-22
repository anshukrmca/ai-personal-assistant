import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration options
  serverExternalPackages: ["firebase-admin", "jwks-rsa"],
};

export default nextConfig;
