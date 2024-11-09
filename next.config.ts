const nextConfig = {
  images: {
    unoptimized: true, // This will bypass Next.js image optimization
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**kvfrbrkjfdgepqdmxwqg.supabase.co',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;