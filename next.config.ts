import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*', // Quand on appelle /api/proxy/...
        destination: 'http://104.236.244.230/api/v1/:path*', // Next.js redirige vers le vrai backend
      },
    ]
  },  
};

export default nextConfig;
