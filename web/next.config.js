/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  async headers() {
    return [{
      source: '/~/storage/:path*',
      headers: [{
        key: 'access-control-allow-origin',
        value: '*',
      }],
    }]
  },
  async rewrites() {
    return [{
      source: '/~/storage/:path*',
      destination: '/api/storage/:path*',
    }]
  }
}
