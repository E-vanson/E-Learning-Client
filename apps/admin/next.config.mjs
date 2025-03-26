/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: "/admin-static",
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  experimental: {
    staleTimes: {
      dynamic: 0,
      static: 180,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3080",
      },
    ],
  },
};

export default nextConfig;
