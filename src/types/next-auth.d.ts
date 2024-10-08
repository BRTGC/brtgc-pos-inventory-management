// src/@types/next-auth.d.ts

import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    username: string;
    role: string; // Define the role as string
  }

  interface Session {
    user: User;
  }

  interface JWT {
    role: string; // Define the role as string
  }
}
