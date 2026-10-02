import type { NextConfig } from "next";
const config: NextConfig = {
  output: "standalone",
  turbopack: { root: process.cwd() },
  outputFileTracingRoot: process.cwd(),
  outputFileTracingExcludes: {
    "/*": [
      "./.env*",
      "./LOCAL-ACCESS.txt",
      "./storage/**/*",
      "./tests/**/*",
      "./docs/**/*",
      "./scripts/assets.json",
    ],
  },
  poweredByHeader: false,
  serverExternalPackages: ["mysql2"],
  images: {
    localPatterns: [{ pathname: "/media/**" }, { pathname: "/api/media/**" }],
    qualities: [75, 95],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/admin/preview",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
        ],
      },
    ];
  },
};
export default config;
