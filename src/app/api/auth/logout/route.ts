// src/app/api/auth/logout/route.ts

import { NextAuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../[...nextauth]/route';

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

  // You can add any additional logic here, like logging the logout event

  // Log the user out
  // Optionally, you could invalidate the session or perform other actions.

  return new Response(JSON.stringify({ message: 'Logged out successfully.' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
