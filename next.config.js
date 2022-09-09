/** @type {import('next').NextConfig} */
const ContentSecurityPolicy = `
  default-src * data: 'unsafe-inline' 'unsafe-eval' https://fonts.gstatic.com;
  style-src * 'self' 'unsafe-inline';
  frame-src 'self' 'unsafe-inline' https://js.stripe.com https://hooks.stripe.com;
  connect-src 'self' https://api.stripe.com http://localhost:4000;
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com;
`
const securityHeaders = [{
  key: 'Content-Security-Policy',
  value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
}]

const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["localhost"]
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
