import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*', // Quand on appelle /api/...
        destination: 'http://localhost:8000/:path*', // Next.js redirige vers le backend
      },
    ];
  },
};

export default nextConfig;