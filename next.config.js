/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'isvwxzrdxrpuiohhvrww.supabase.co',
        pathname: '/storage/v1/object/sign/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/api/webhooks/stripe',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'POST,OPTIONS' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;