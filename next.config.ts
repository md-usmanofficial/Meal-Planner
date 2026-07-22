import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Spoonacular recipe images
      {
        protocol: "https",
        hostname: "img.spoonacular.com",
        pathname: "/**",
      },
      // TheMealDB recipe images
      {
        protocol: "https",
        hostname: "www.themealdb.com",
        pathname: "/**",
      },
      // Open Food Facts product images
      {
        protocol: "https",
        hostname: "images.openfoodfacts.org",
        pathname: "/**",
      },
      // Open Food Facts static images
      {
        protocol: "https",
        hostname: "static.openfoodfacts.org",
        pathname: "/**",
      },
      // Supabase Storage (user avatars)
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  // Enable React strict mode for better development warnings
  reactStrictMode: true,

  // Experimental features for Next.js 15
  experimental: {
    // Optimize package imports for icon libraries
    optimizePackageImports: ["lucide-react", "recharts", "framer-motion"],
  },
};

export default nextConfig;
