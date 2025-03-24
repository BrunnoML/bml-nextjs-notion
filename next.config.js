/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Mantém o React Strict Mode ativado
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