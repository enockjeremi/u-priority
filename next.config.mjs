/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL: process.env.API_URL,
    TOKEN: process.env.TOKEN_NAME,
  },
};

export default nextConfig;
