import { DefaultSession, DefaultUser, JWT as DefaultJWT } from "next-auth";

// Extend the default User model
declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    username?: string | null;
    role?: string | null;
  }

  // Extend the Session interface
  interface Session extends DefaultSession {
    user: {
      id: string;
      username?: string | null;
      role?: string | null;
      name?: string | null;
      email?: string | null;
    };
  }
}

// Extend JWT interface
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    username?: string | null;
    role?: string | null;
    name?: string | null;
    email?: string | null;
  }
}
