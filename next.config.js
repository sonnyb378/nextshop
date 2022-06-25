/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "cdn.shopify.com",
      "tailwindui.com"
    ]
  }
}

module.exports = nextConfig
