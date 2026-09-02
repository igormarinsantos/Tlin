/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── Image Optimization ───────────────────────────────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
    ],
    // Limit max image sizes cached server-side
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  // ── Network & Security ───────────────────────────────────────────────────
  compress: true,
  poweredByHeader: false,

  // ── Domain migration ─────────────────────────────────────────────────────
  // Keep the former public domain attached to this Vercel project so these
  // permanent redirects preserve paths and query parameters for search engines.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "(?:www\\.)?tlin\\.cloud" }],
        destination: "https://tlin.ia.br/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www\\.tlin\\.ia\\.br" }],
        destination: "https://tlin.ia.br/:path*",
        permanent: true,
      },
    ];
  },

  // ── Bundle Optimization ───────────────────────────────────────────────────
  experimental: {
    // Aggressive tree-shaking for popular packages (reduces unused JS)
    optimizePackageImports: [
      'framer-motion',
      'lucide-react',
      '@radix-ui/react-icons',
    ],
  },

  // ── Headers: Cache busting for static assets (resolves cache audit) ───────
  async headers() {
    // Only apply aggressive caching in production to avoid stale files in development
    if (process.env.NODE_ENV !== 'production') {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'Cache-Control',
              value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
            },
            {
              key: 'Pragma',
              value: 'no-cache',
            },
            {
              key: 'Expires',
              value: '0',
            },
          ],
        },
      ];
    }

    return [
      {
        // Immutable cache for hashed static files (JS, CSS chunks)
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Long-lived cache for public assets (images, fonts, svgs, videos)
        source: '/(.*)\\.(png|jpg|jpeg|webp|avif|svg|woff2|woff|ico|mp4|webm)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=86400',
          },
        ],
      },
      {
        // HTML pages: no-cache so new deploys are always picked up
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
