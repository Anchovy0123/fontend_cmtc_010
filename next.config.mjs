/** @type {import('next').NextConfig} */
const apiBase = (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://010-backend.vercel.app').replace(/\/+$/, '');
const apiDestination = apiBase.endsWith('/api') ? `${apiBase}/:path*` : `${apiBase}/api/:path*`;

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: apiDestination,
      },
    ];
  },
};

export default nextConfig;
