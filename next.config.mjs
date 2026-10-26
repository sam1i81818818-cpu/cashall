/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  images: {
    unoptimized: true,
    minimumCacheTTL: 2592000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico|woff|woff2|ttf|apk)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/v1/download/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=2592000, immutable',
          },
        ],
      },
      {
        source: '/api/v1/orders/model-velocity',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source: '/api/v1/devices/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/api/v1/brands/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/api/v1/categories/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/api/v1/catalog',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/api/v1/catalog/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/api/v1/serviceability/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source: '/api/v1/reviews/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/sell/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source: '/blog/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source: '/news/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source: '/articles/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source: '/compare/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source: '/:path*(sitemap.xml|robots.txt|llms.txt|llms-full.txt|ai.txt)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source: '/api/v1/legal/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source: '/api/v1/agent/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, no-cache, no-store, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/api/v1/agent/orders',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=30, s-maxage=30, stale-while-revalidate=60',
          },
        ],
      },
      {
        source: '/api/v1/admin/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, no-cache, no-store, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/api/v1/admin/orders/latest-check',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, s-maxage=60, stale-while-revalidate=120',
          },
        ],
      },
      {
        source: '/api/v1/orders/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, no-cache, no-store, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/api/v1/partner/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, no-cache, no-store, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source: '/sell-used-phone',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source: '/sell-phone-:city*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source: '/pickup-policy',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source: '/doorstep-pickup-policy',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source: '/about-us',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source: '/faq',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source: '/contact',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source: '/reviews',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'cashall-pi.vercel.app',
          },
        ],
        destination: 'https://www.cashall.in/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'cashall.vercel.app',
          },
        ],
        destination: 'https://www.cashall.in/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'cashall.in',
          },
        ],
        destination: 'https://www.cashall.in/:path*',
        permanent: true,
      },
      {
        source: '/compare/cashify-vs-cashall',
        destination: '/compare/cashall-vs-other-platforms',
        permanent: true,
      },
      {
        source: '/site.xml',
        destination: '/sitemap.xml',
        permanent: true,
      },
      {
        source: '/robot.txt',
        destination: '/robots.txt',
        permanent: true,
      },
      {
        source: '/sell-old-mobile-phones',
        destination: '/sell-old-mobile-phone',
        permanent: true,
      },
      {
        source: '/sell-old-mobile-phones/:path*',
        destination: '/sell-old-mobile-phone/:path*',
        permanent: true,
      },
      {
        source: '/sell/mobile',
        destination: '/sell-old-mobile-phone',
        permanent: true,
      },
      {
        source: '/sell/mobile/:brand',
        destination: '/sell-old-mobile-phone/:brand',
        permanent: true,
      },
      {
        source: '/sell/mobile/:brand/:model',
        destination: '/sell-old-mobile-phone/:brand/:model',
        permanent: true,
      },
      {
        source: '/sell/mobile/:brand/:model/assess',
        destination: '/sell-old-mobile-phone/:brand/:model/assess',
        permanent: true,
      },
      // Laptop Permanent Redirects (Competitor Cashify & CashKR alignment)
      {
        source: '/sell-old-laptops',
        destination: '/sell-old-laptop',
        permanent: true,
      },
      {
        source: '/sell-old-laptops/:path*',
        destination: '/sell-old-laptop/:path*',
        permanent: true,
      },
      {
        source: '/sell/laptop',
        destination: '/sell-old-laptop',
        permanent: true,
      },
      {
        source: '/sell/laptop/:brand',
        destination: '/sell-old-laptop/:brand',
        permanent: true,
      },
      {
        source: '/sell/laptop/:brand/:model',
        destination: '/sell-old-laptop/:brand/:model',
        permanent: true,
      },
      {
        source: '/sell/laptop/:brand/:model/assess',
        destination: '/sell-old-laptop/:brand/:model/assess',
        permanent: true,
      },
      // Tablet Permanent Redirects (Competitor Cashify & CashKR alignment)
      {
        source: '/sell-old-tablets',
        destination: '/sell-old-tablet',
        permanent: true,
      },
      {
        source: '/sell-old-tablets/:path*',
        destination: '/sell-old-tablet/:path*',
        permanent: true,
      },
      {
        source: '/sell/tablet',
        destination: '/sell-old-tablet',
        permanent: true,
      },
      {
        source: '/sell/tablet/:brand',
        destination: '/sell-old-tablet/:brand',
        permanent: true,
      },
      {
        source: '/sell/tablet/:brand/:model',
        destination: '/sell-old-tablet/:brand/:model',
        permanent: true,
      },
      {
        source: '/sell/tablet/:brand/:model/assess',
        destination: '/sell-old-tablet/:brand/:model/assess',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/sell-my-phone',
        destination: '/sell-used-phone',
      },
      {
        source: '/sell-my-old-phone',
        destination: '/sell-used-phone',
      },
      {
        source: '/sell-old-mobile',
        destination: '/sell-used-phone',
      },
      {
        source: '/old-phone-sell',
        destination: '/sell-used-phone',
      },
    ];
  },
};

export default nextConfig;
