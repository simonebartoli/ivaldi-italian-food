/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["api.ivaldi.uk"],
    unoptimized: false
  }
  // async headers() {
  //   return [
  //     {
  //       // Apply these headers to all routes in your application.
  //       source: '/checkout',
  //       headers: securityHeaders
  //     }
  //   ]
  // }
}

module.exports = nextConfig
