import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // 1. The Pattern: What the browser/Next.js looks for
        source: '/api/:path*',
        
        // 2. The Destination: Where Docker routes the traffic internally.
        // If you set up the Nginx service, change this to 'http://nginx:80/api/:path*'
        destination: 'http://nginx:80/api/:path*',
      },
    ];
  },
};

export default nextConfig;
