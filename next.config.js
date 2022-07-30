/** @type {import('next').NextConfig} */
const ContentSecurityPolicy = `
  default-src *;
  style-src 'self' 'unsafe-inline';
  connect-src https://api.stripe.com;
  frame-src https://js.stripe.com;
  script-src 'self' https://js.stripe.com;
`
const securityHeaders = [{
  key: 'Content-Security-Policy',
  value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
}]

const nextConfig = {
  reactStrictMode: false
}

module.exports = nextConfig
