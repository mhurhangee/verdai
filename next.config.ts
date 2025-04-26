import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        // this matches any subdomain of public.blob.vercel-storage.com
        hostname: '*.public.blob.vercel-storage.com',
        // you can optionally lock down the path if you only serve from /user/
        pathname: '/**',
      },
    ],
  },
  transpilePackages: ['next-mdx-remote'],
}

export default nextConfig
