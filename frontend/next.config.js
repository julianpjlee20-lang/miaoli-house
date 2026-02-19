/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Docker 部署需要 standalone output
  output: 'standalone',
  // 確保靜態檔案被複製
  outputFileTracingIncludes: {
    '/data/**': ['./src/data/**'],
  },
  
  // 環境變數
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '',
    NEXT_PUBLIC_POCKETBASE_URL: process.env.NEXT_PUBLIC_POCKETBASE_URL || '',
  },
};

module.exports = nextConfig;
