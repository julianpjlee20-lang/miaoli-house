/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_POCKETBASE_URL: process.env.NEXT_PUBLIC_POCKETBASE_URL,
  },
};

module.exports = nextConfig;
