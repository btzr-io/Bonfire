import { NextResponse } from "next/server";
import { getIronSession } from "iron-session/edge";
import { ironOptions } from "lib/config";

const redirect = (request, redirectUrl) => {
  const url = request.nextUrl.clone();
  if (url.pathname == redirectUrl) return NextResponse.next();
  url.pathname = redirectUrl;
  return NextResponse.redirect(url);
};

export async function middleware(req) {
  const res = NextResponse.next();
  // Login is hidden
  if (process.env.BONFIRE_LOGING_HIDDEN == "true") {
    return redirect(req, "/");
  }

  const session = await getIronSession(req, res, ironOptions);
  const { user } = session;
  if (user && user.admin) {
    if (req.nextUrl.pathname == "/login") {
      return redirect(req, "/");
    }
    return res;
  }
  // Authentication required
  return redirect(req, "/login");
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
