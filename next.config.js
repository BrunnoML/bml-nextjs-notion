/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // A mídia do blog deve passar pelo proxy sem entrar no cache do otimizador.
    localPatterns: [{ pathname: '/images/**', search: '' }],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24,
  },
};

module.exports = nextConfig;
