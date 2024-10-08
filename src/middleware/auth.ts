// src/middleware/auth.ts
import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  // Get the token from the request
  const token = await getToken({ req: request });

  const { pathname } = request.nextUrl;

  // Define the protected routes
  const protectedRoutes = ['/dashboard', '/products', '/sales']; // Adding products and sales

  // Check if the user is authenticated
  const isAuthenticated = !!token;

  // Log for debugging
  console.log(`Request made to: ${pathname}, Authenticated: ${isAuthenticated}`);

  // If the user is authenticated, allow access to all routes
  if (isAuthenticated) {
    return NextResponse.next();
  }

  // If the user is not authenticated, restrict access to protected routes
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/login', request.url)); // Redirect to login page
  }

  // Allow access to the home and login pages
  if (pathname === '/' || pathname === '/login') {
    return NextResponse.next();
  }

  // Allow access to all other routes
  return NextResponse.next();
}

// Apply the middleware to specific paths
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'], // Exclude API routes and static files
};
