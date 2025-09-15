/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // For Vercel deployment
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ]
  },

  // Handle environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Optimize for production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Handle static assets
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
}

module.exports = nextConfig