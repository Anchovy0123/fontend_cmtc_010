/** @type {import('next').NextConfig} */
const apiBase = 'https://010-backend.vercel.app';
const apiBaseNormalized = apiBase.replace(/\/+$/, '');
const apiDestination = apiBaseNormalized.endsWith('/api')
  ? `${apiBaseNormalized}/:path*`
  : `${apiBaseNormalized}/api/:path*`;
const loginDestination = `${apiBaseNormalized}/login`;
const logoutDestination = `${apiBaseNormalized}/logout`;
const usersDestination = `${apiBaseNormalized}/users`;
const usersDestinationWithPath = `${apiBaseNormalized}/users/:path*`;

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/users',
        destination: usersDestination,
      },
      {
        source: '/users/:path*',
        destination: usersDestinationWithPath,
      },
      {
        source: '/api/login',
        destination: loginDestination,
      },
      {
        source: '/api/logout',
        destination: logoutDestination,
      },
      {
        source: '/api/:path*',
        destination: apiDestination,
      },
    ];
  },
};

export default nextConfig;
