import { UserRole } from "@prisma/client";
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      role: string;
      needsUsername?: boolean;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    username?: string;
    role: UserRole;
  }
} 