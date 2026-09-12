import { NextRequest, NextResponse } from "next/server";


export function proxy(request: NextRequest) {
  const cookie = request.cookies.get("access_token");

  // console.log("COOKIE OBJECT:", cookie);
  // console.log("COOKIE VALUE:", cookie?.value);

  if (!cookie?.value) {
    console.log("❌ NO ACCESS TOKEN");
    return NextResponse.redirect(
      new URL("/auth/login", request.url)
    );
  }

  // console.log("✅ ACCESS TOKEN FOUND");

  return NextResponse.next();
}
export const config = {
  matcher: ["/admin/:path*"],
};