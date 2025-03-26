/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 's3.us-west-2.amazonaws.com', // Domínio alternativo do Notion
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com', // Fallback para qualquer domínio AWS
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'cdn2.thecatapi.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
      },
      {
        protocol: 'https',
        hostname: 'images.prismic.io',
      },
      {
        protocol: 'https',
        hostname: 'images.contentful.com',
      },
      {
        protocol: 'https',
        hostname: 'images.microcms-assets.io',
      },
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
      },
      // Adicione este novo padrão para o LinkedIn
      {
        protocol: 'https',
        hostname: 'media.licdn.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.weserv.nl',
      },
      // Adicione outros domínios necessários
    ],
  },
  async headers() {
    return [
      {
        source: "/blog",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=1, stale-while-revalidate=59",
          },
        ],
      },
      {
        source: "/blog/:slug",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=1, stale-while-revalidate=59",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;