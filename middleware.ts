import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');
  
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isProtectedRoute = !isAuthPage && request.nextUrl.pathname !== '/';

  // If accessing auth pages while already authenticated, redirect to dashboard
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If accessing protected routes without authentication, redirect to login
//   if (isProtectedRoute && !token) {
//     return NextResponse.redirect(new URL('/auth/login', request.url));
//   }

  return NextResponse.next();
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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};