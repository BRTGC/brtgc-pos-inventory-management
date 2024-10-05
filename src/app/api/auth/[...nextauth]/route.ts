// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from '../../../../../prisma';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'your@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });

        // Check if user exists and password matches
        if (user && (await bcrypt.compare(credentials?.password, user.password))) {
          return {
            id: user.id,
            username: user.username,
            email: user.email,
            name: user.name, // Include additional fields
            role: user.role,
            // Add any other user details you want to store
          }; 
        }

        return null; // Return null if user data could not be retrieved
      },
    }),
  ],
  pages: {
    signIn: '/login', // Custom login page
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Store user ID in token
        token.role = user.role; // Store user role in token
        token.username = user.username; // Store user role in token
        token.email = user.email; // Store user email
        token.name = user.name; // Store user name
        // Add any additional user details here
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id; // Add user ID to session
      session.user.role = token.role; // Add user role to session
      session.user.username = token.username; // Add user role to session
      session.user.email = token.email; // Add user email to session
      session.user.name = token.name; // Add user name to session
      // Add any additional user details here
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; // Export GET and POST methods
