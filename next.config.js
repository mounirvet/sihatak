/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export — the cleanest possible signal for AI crawlers
  // and search engines. No JS-dependent content rendering.
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Site is Arabic-first, RTL
  reactStrictMode: true,
};

module.exports = nextConfig;
