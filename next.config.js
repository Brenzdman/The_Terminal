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
        headers: nextSafe({
          isDev,
          contentSecurityPolicy: {
            "default-src": ["'self'"],
            "script-src": [
              "'self'",
              "'unsafe-inline'",
              //   "https://plausible.io/js/script.js", // Analytics
            ],
            "img-src": ["'self'", "blob:"],
            "style-src": ["'self'", "'unsafe-inline'"],
            "connect-src": [
              "'self'",
              //   "https://plausible.io", // Analytics
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
      },
    ];
  },
};

module.exports = nextConfig;
