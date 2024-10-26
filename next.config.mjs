import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['https://lh3.googleusercontent.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  transpilePackages: ['next-mdx-remote'],
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

export default withMDX(nextConfig);
