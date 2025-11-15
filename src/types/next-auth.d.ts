import { DefaultSession, DefaultUser } from "next-auth";
import { IUser } from "@/models/user.model";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    role: IUser["role"];
    profile_url?: string;
  }

  interface Session {
    user: {
      id: string;
      role: IUser["role"];
      profile_url?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: IUser["role"];
    profile_url?: string;
  }
}
