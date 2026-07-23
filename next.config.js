/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://isvwxzrdxrpuiohhvrww.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlzdnd4enJkeHJwdWlvaGh2cnd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1NzgxMTUsImV4cCI6MjEwMDE1NDExNX0.bdEuh5ApVpwxC2YySafgZ4IoRNy3cTK4XLqozwEKWNw',
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://millerss.co.uk',
  },
  allowedDevOrigins: ['192.168.0.5'],
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