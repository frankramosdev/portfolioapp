// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    PLAID_CLIENT_ID: process.env.PLAID_CLIENT_ID,
    PLAID_SECRET: process.env.PLAID_SECRET,
    PLAID_ENV: process.env.PLAID_ENV,
    PLAID_SANDBOX_REDIRECT_URI: process.env.PLAID_SANDBOX_REDIRECT_URI,
  },
};

export default nextConfig;
