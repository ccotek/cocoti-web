/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Désactiver le cache des images pour le développement
    unoptimized: process.env.NODE_ENV === 'development',
  },
  // Configuration pour résoudre les problèmes de chunks sur Windows
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ['**/node_modules/**', '**/.next/**'],
      };
    }
    
    // Configuration pour éviter les problèmes de fichiers temporaires sur Windows
    config.resolve.symlinks = false;
    config.cache = false; // Désactiver le cache pour éviter les problèmes de permissions
    
    return config;
  },
  // Configuration pour éviter les problèmes de chunks
  generateEtags: false,
  poweredByHeader: false,
  compress: true,
  // Configuration pour le déploiement
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  trailingSlash: false,
  // Configuration pour éviter les problèmes de build sur Windows
  reactStrictMode: true,
  // Désactiver les optimisations qui causent des problèmes sur Windows
  experimental: {
    optimizeCss: false,
    optimizePackageImports: [],
  },
  // Configuration spécifique pour Windows
  outputFileTracingRoot: process.cwd(),
  // Désactiver le tracing pour éviter les problèmes de permissions
  generateBuildId: () => 'build',
};

module.exports = nextConfig;
