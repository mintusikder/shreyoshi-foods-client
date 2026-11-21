
/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */

  experimental: {
    agentUpgrade: "security",
  },

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  // ImgBB Image Configuration
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
    ],
  },
};

export default nextConfig;
