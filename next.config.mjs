/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['https://lh3.googleusercontent.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
