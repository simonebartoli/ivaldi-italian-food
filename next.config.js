/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["localhost"]
    // unoptimized: true
  },
  exportPathMap: async function (
      defaultPathMap,
      { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      '/index': { page: '/work-in-progress' }
    }
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
