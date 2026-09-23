import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: ['localhost'],
  },
  async rewrites() {
    // SSR runs inside Docker container, use internal hostname
    const backendUrl = process.env.NEXT_PUBLIC_API_URL_INTERNAL || 'http://backend:4000/api/v1';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
