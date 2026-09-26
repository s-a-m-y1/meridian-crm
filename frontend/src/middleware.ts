import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = ['/dashboard', '/leads', '/customers', '/properties', '/deals', '/tasks', '/activities', '/settings'];

export function middleware(request: NextRequest) {
  // Gate on EITHER token cookie. access_token expires quickly (JWT ~15min TTL),
  // so the 30-day refresh_token cookie is the real session hint — gating on
  // access_token alone used to force re-login after 24h while the backend
  // session was still valid. Route protection itself is still enforced by the
  // API (401s), and client-side auth context rehydrates via the refresh token.
  const access = request.cookies.get('access_token')?.value;
  const refresh = request.cookies.get('refresh_token')?.value;
  const hasSession = Boolean(access || refresh);
  const pathname = request.nextUrl.pathname;

  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  if (isProtectedPath && !hasSession) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/leads/:path*',
    '/customers/:path*',
    '/properties/:path*',
    '/deals/:path*',
    '/tasks/:path*',
    '/activities/:path*',
    '/settings/:path*',
  ],
};
