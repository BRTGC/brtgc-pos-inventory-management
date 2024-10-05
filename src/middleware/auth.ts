import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  // Allow access to the login page and any public resources
  if (pathname.startsWith('/login')) return NextResponse.next();

  // Redirect to login if the user is not authenticated
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Only allow admins to access certain routes
  if (pathname.startsWith('/admin') && token.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}
