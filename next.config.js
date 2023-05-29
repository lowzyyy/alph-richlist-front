/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { esmExternals: true },
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/pages/1",
        destination: "/",
      },
      {
        source: "/1",
        destination: "/",
      },
      {
        source: "/pages/:page",
        destination: "/:page",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/:page((?:10[1-9])|(?:10[0-9]{2,}))",
        destination: "/pages/100",
        permanent: true,
      },
      {
        source: "/pages/:page((?:10[1-9])|(?:10[0-9]{2,}))",
        destination: "/pages/100",
        permanent: true,
      },
      {
        source: "/pages/:page((?:-[0-9]+)|(?:0))",
        destination: "/pages/1",
        permanent: true,
      },
      {
        source: "/:page((?:-[0-9]+)|(?:0))",
        destination: "/pages/1",
        permanent: true,
      },
    ];
  },
  webpack: (config) => {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
};
module.exports = nextConfig;
