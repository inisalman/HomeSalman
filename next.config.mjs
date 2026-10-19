/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/project/naratama",
        destination: "/project/naratama/index.html",
      },
    ];
  },
};

export default nextConfig;
