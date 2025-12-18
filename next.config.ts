import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.dribbble.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "assets-global.website-files.com" },
      { protocol: "https", hostname: "via.placeholder.com" },
      { protocol: "http", hostname: "localhost", port: "4000" }
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 2000,
        aggregateTimeout: 500,
        ignored: ['**/node_modules/**', '**/.next/**', '**/src/i18n/messages/**'],
      };
    }
    config.resolve.symlinks = false;
    return config;
  },
  generateEtags: false,
  poweredByHeader: false,
  compress: true,
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  trailingSlash: false,
  reactStrictMode: process.env.NODE_ENV === 'production',
  experimental: {
    optimizeCss: false,
    optimizePackageImports: [],
  },
  outputFileTracingRoot: process.cwd(),
  generateBuildId: () => 'build',
  async headers() {
    return [
      {
        source: '/.well-known/apple-app-site-association',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600',
          },
        ],
      },
      {
        source: '/.well-known/assetlinks.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
