import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for client-side only build
  output: "export",
  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh4.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh5.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh6.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // Use Webpack for builds (Turbopack is default in Next.js 16)
  // Empty turbopack config to silence warnings
  turbopack: {},
};

export default nextConfig;
