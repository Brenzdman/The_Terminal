const nextSafe = require("next-safe");
const isDev = process.env.NODE_ENV !== "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          ...nextSafe({
            isDev,
            contentSecurityPolicy: {
              "default-src": ["'self'"],
              "script-src": [
                "'self'",
                "'unsafe-inline'",
                ...(isDev ? ["'unsafe-eval'"] : []), // Add unsafe-eval in dev
                // "https://plausible.io/js/script.js", // Analytics
              ],
              "img-src": ["'self'", "blob:"],
              "style-src": ["'self'", "'unsafe-inline'"],
              "connect-src": [
                "'self'",
                ...(isDev ? ["http://localhost:3000"] : []),
                // "https://plausible.io", // Analytics
              ],
              "prefetch-src": false,
              "frame-ancestors": ["'none'"],
              "form-action": ["'self'"],
            },
            strictTransportSecurity:
              "max-age=63072000; includeSubDomains; preload",
            xContentTypeOptions: "nosniff",
            xFrameOptions: "DENY",
            xXssProtection: "1; mode=block",
            referrerPolicy: "no-referrer",
            permissionsPolicy: {
              geolocation: ["'none'"],
              camera: ["'none'"],
              microphone: ["'none'"],
              fullscreen: ["'self'"],
            },
          }),
          // CORS headers
          {
            key: "Access-Control-Allow-Origin",
            value: isDev
              ? "http://localhost:3000"
              : "https://cmdterminal.vercel.app",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "X-Requested-With, Content-Type, Authorization",
          },
          // Ensure Content-Security-Policy header is defined
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; " +
              "script-src 'self' 'unsafe-inline'" +
              (isDev ? " 'unsafe-eval'" : "") +
              "; " +
              "img-src 'self' blob:; " +
              "style-src 'self' 'unsafe-inline'; " +
              `connect-src 'self' ${isDev ? "http://localhost:3000" : ""}; ` +
              "frame-ancestors 'none'; " +
              "form-action 'self';",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
