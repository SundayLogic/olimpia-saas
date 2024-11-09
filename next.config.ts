/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['kvfrbrkjfdgepqdmxwqg.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '**',
      },
    ],
  },
}

export default nextConfig;