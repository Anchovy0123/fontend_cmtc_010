/** @type {import('next').NextConfig} */
const apiBase = 'https://010-backend.vercel.app';
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
