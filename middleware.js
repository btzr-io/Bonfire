import { NextResponse } from "next/server";

const redirect = (request, redirectUrl) => {
  const url = request.nextUrl.clone();
  if (url.pathname == redirectUrl) {
    return NextResponse.next();
  }
  url.pathname = redirectUrl;
  return NextResponse.redirect(url);
};

export function middleware(request) {
  // Login is hidden
  if (process.env.BONFIRE_LOGING_HIDDEN == "true") {
    return redirect(request, "/");
  }

  // Authentication required
  return redirect(request, "/login");
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|logo.svg|logo_dark.svg).*)",
  ],
};
