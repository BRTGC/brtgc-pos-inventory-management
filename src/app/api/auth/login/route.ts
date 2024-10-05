// src/app/api/auth/login/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../[...nextauth]/route';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.redirect(new URL('/login', request.url));
}
