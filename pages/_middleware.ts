import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(_: NextRequest, __: NextFetchEvent) {
  const res = NextResponse.next();

  res.headers.set("Referrer-Policy", "origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "geolocation=()");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-DNS-Prefetch-Control", "on");

  return res;
}
