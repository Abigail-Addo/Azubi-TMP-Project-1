import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  images: {
    domains: ["res.cloudinary.com"],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*", // You call this from your frontend
        destination: "https://tmp-se-projectapi.azurewebsites.net/api/:path*", // This is your Express API
      },
    ];
  },
};

export default nextConfig;
