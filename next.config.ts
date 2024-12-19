import bundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kvfrbrkjfdgepqdmxwqg.supabase.co',
        pathname: '/storage/v1/object/public/**',
      } as const,
    ],
  },
};

export default withBundleAnalyzer(nextConfig);