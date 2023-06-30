/** @type {import('next').NextConfig} */
module.exports = {
    pageExtensions: ['mdx', 'md', 'jsx', 'js', 'tsx', 'ts'],
  
  reactStrictMode: true,
  images: {
    domains: ["cdn.discordapp.com"],
  },
  experimental: {
    appDir: true,
  },
};
