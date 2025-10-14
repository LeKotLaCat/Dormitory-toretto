import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // เพิ่มบรรทัดนี้เข้าไป
  output: 'standalone',

  images: {
    domains: ['www.it.kmitl.ac.th'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
