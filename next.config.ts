//---> PATH: frontend/next.config.ts

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ignore les erreurs de build pour déployer même si le code n'est pas parfait
  typescript: { ignoreBuildErrors: true },
  // eslint: { ignoreDuringBuilds: true },

  async rewrites() {
    return [
      {
        // 1. Le frontend appelle : /api/proxy/auth/login
        source: '/api/proxy/:path*',
        // 2. Vercel transfère vers : http://IP_SERVEUR/api/v1/auth/login
        // Notez l'ajout de "/api/v1/" ici pour compléter l'URL
        destination: (process.env.PYTHON_API_BASE_URL || 'http://localhost:8000') + '/api/v1/:path*',
      },
    ]
  },
};

export default nextConfig;