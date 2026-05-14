import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const user = verifyToken(token);
  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/tracker/:path*", "/profile/:path*"],
};
