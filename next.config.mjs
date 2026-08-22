const appId =
  process.env.NEXT_PUBLIC_BASE44_APP_ID ||
  process.env.VITE_BASE44_APP_ID ||
  process.env.BASE44_APP_ID ||
  "6a6b64082a3e26226bfba099";

const apiUrl = (
  process.env.NEXT_PUBLIC_BASE44_API_URL ||
  process.env.VITE_BASE44_API_URL ||
  process.env.BASE44_API_URL ||
  "https://base44.app"
).replace(/\/$/, "");

const appBaseUrl = (
  process.env.NEXT_PUBLIC_BASE44_APP_BASE_URL ||
  process.env.VITE_BASE44_APP_BASE_URL ||
  process.env.BASE44_APP_BASE_URL ||
  ""
).replace(/\/$/, "");

const functionsVersion =
  process.env.NEXT_PUBLIC_BASE44_FUNCTIONS_VERSION ||
  process.env.VITE_BASE44_FUNCTIONS_VERSION ||
  process.env.BASE44_FUNCTIONS_VERSION ||
  "";

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BASE44_APP_ID: appId,
    NEXT_PUBLIC_BASE44_API_URL: apiUrl,
    NEXT_PUBLIC_BASE44_APP_BASE_URL: appBaseUrl,
    NEXT_PUBLIC_BASE44_FUNCTIONS_VERSION: functionsVersion,
  },
  async rewrites() {
    if (!appBaseUrl) return [];

    return [
      {
        source: "/api/:path*",
        destination: `${appBaseUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
