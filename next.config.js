/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/DrawingFeed',
        permanent: true,
      },
    ]
  }
}

module.exports = nextConfig
