import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // On supprime la section 'rewrites' car elle entre en conflit avec notre route API Proxy
  // et ne permet pas d'injecter le token Clerk facilement.
};

export default nextConfig;