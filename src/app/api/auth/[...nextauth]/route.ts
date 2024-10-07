import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from '../../../../../prisma'; // Import Prisma client

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'your@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Fetch user from database
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });

        // Verify user exists and password matches
        if (user && (await bcrypt.compare(credentials.password, user.password))) {
          return {
            id: user.id,
            username: user.username,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        }

        return null; // Authentication failed
      },
    }),
  ],
  pages: {
    signIn: '/login', // Custom login page
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.username = token.username;
      session.user.email = token.email;
      session.user.name = token.name;
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60, // 1 hour session timeout
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure you have this in your .env file
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
