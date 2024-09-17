import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
const isDev = process.env.NODE_ENV !== "production";

// This middleware only applies to API routes like /api/envVars
const allowedIPs = ["76.76.21.142", "76.76.21.164"]; // Replace with your server IP addresses

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Only apply this middleware to API routes
  if (url.pathname.startsWith("/api")) {
    // Check for a custom server-side request header
    const serverSideHeader = req.headers.get("x-server-side-request");

    // Get the IP address of the request
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : req.ip;
    
    // If the request is missing the header, the IP is not allowed, or the protocol is not HTTPS in production, return 403 Forbidden
    if (
      !serverSideHeader ||
      serverSideHeader !== "true" ||
      (!isDev && url.protocol !== "https:") ||
      (!isDev && !allowedIPs.includes(ip ?? ""))
    ) {
      return NextResponse.json(
        { error: "Forbidden: server-side requests only" },
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
