import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const assetPrefix =
  process.env.NEXT_PUBLIC_ASSET_PREFIX ||
  (isProd ? "https://vroomsites-dleszczs-projects.vercel.app" : undefined);

const nextConfig: NextConfig = {
  assetPrefix,
  images: {
    qualities: [75, 80, 85],
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "**.olxcdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "autoplac.pl",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.autoplac.pl",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
