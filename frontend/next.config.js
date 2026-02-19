/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 輸出靜態檔案（用於 Static 部署）
  output: 'export',
  // 靜態輸出時禁用圖片優化
  images: { unoptimized: true },
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
