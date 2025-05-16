import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { isDevelopmentEnvironment } from './lib/constants';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes and API routes to pass through
  if (
    pathname.startsWith('/ping') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/chat') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // This will allow static files
  ) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: !isDevelopmentEnvironment,
  });

  // Handle auth pages
  if (['/login', '/register'].includes(pathname)) {
    if (token) {
      // If user is authenticated, redirect to home
      return NextResponse.redirect(new URL('/', request.url));
    }
    // If not authenticated, allow access to auth pages
    return NextResponse.next();
  }

  // For all other routes, check authentication
  if (!token) {
    // Store the original URL to redirect back after login
    const callbackUrl = encodeURIComponent(request.url);
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${callbackUrl}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
