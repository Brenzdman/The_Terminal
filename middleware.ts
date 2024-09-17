import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This middleware only applies to API routes like /api/envVars
export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Only apply this middleware to API routes, specifically envVars
  if (url.pathname.startsWith("/api/envVars")) {
    // Check for a custom server-side request header
    const serverSideHeader = req.headers.get("x-server-side-request");

    // If the request is missing the header, return 403 Forbidden
    if (!serverSideHeader) {
      return NextResponse.json(
        { error: "Forbidden: server-side requests only" },
        { status: 403 }
      );
    }
  }

  // Allow the request to continue if everything checks out
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/envVars"],
};
