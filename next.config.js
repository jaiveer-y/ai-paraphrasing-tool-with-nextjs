/** @type {import('next').NextConfig} */
module.exports = {
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],
  reactStrictMode: true,
  images: {
    domains: ["cdn.discordapp.com"],
  },
  experimental: {
    appDir: true,
  },
};
