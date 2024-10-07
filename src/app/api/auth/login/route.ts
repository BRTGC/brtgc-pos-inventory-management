// src/app/api/auth/login/route.ts

import { NextAuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../[...nextauth]/route';
import { signOut } from 'next-auth/react'; // Ensure this import is available if using in a client-side component

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  // Check if there's an active session
  if (!session) {
    return new Response(JSON.stringify({ error: 'No active session found.' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return new Response(JSON.stringify({ message: 'Logged out successfully.' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
