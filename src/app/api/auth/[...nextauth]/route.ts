import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt"; // Type for JWT
import { Session, User } from "next-auth"; // Types for Session and User

const prisma = new PrismaClient();

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" },
        username: { label: "Username", type: "text", placeholder: "username" }, // Include username for signup
        name: { label: "Name", type: "text", placeholder: "Name" }, // Include name for signup
        role: { label: "Role", type: "text", placeholder: "USER" }, // Role for user
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("No credentials provided");
        }

        const { email, password, username, name, role } = credentials;

        let user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          const hashedPassword = await bcrypt.hash(password, 10);
          user = await prisma.user.create({
            data: {
              email,
              password: hashedPassword,
              username,
              name,
              role,
            },
          });
        } else {
          const isMatch = bcrypt.compareSync(password, user.password);
          if (!isMatch) {
            throw new Error("Invalid email or password");
          }
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.username = token.username as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour
    updateAge: 30 * 60, // 30 minutes
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
