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
                // "https://plausible.io/js/script.js", // Analytics
              ],
              "img-src": ["'self'", "blob:"],
              "style-src": ["'self'", "'unsafe-inline'"],
              "connect-src": [
                "'self'",
                // "https://plausible.io", // Analytics
              ],
              // prefetch-src is deprecated
              // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/prefetch-src
              "prefetch-src": false,
            },
            // Additional security headers
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
            value: "https://cmdterminal.vercel.app", // Replace with your specific domain
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
              "default-src 'self'; script-src 'self' 'unsafe-inline'; img-src 'self' blob:; style-src 'self' 'unsafe-inline'; connect-src 'self';",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
