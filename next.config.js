module.exports = {
  swcMinify: false,
  trailingSlash: true,
  env: {
    // HOST
    HOST_API_KEY: 'http://localhost:8001',
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACK_URL}/api/:path*`,
      },
    ]
  },
  env: {
    BACK_URL: process.env.BACK_URL,
  }
};
