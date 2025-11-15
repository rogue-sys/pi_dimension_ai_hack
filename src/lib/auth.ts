/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { IUser, User } from "@/models/user.model";
import { connectDB } from "./db";


export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password as string;

        if (!email || !password) return null;

        await connectDB();

        const user = await User.findOne({ email });
        if (!user) return null;

        if (user.provider !== "credential") {
          throw new Error(`Please continue with ${user.provider} login`);
        }

        const isValid = await bcrypt.compare(password, user.password || "");
        if (!isValid) return null;


        return {
          id: user._id!.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          profile_url: user.profile_url,
        };
      }
    }),

    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "user";
        token.profile_url = (user as any).profile_url || null;
      }

      if (account?.provider === "google" && profile) {
        await connectDB();

        let existingUser = await User.findOne({ email: profile.email });

        if (!existingUser) {
          existingUser = await User.create({
            email: profile.email,
            name: profile.name,
            profile_url: profile.image,
            provider: "google",
            emailVerified: true,
            role: "user",
          });
        }

        token.id = existingUser._id!.toString();
        token.role = existingUser.role || "user";
        token.profile_url = existingUser.profile_url;
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as IUser["role"];
        session.user.profile_url = token.profile_url as string;
      }
      return session;
    },
  },

}

const handler = NextAuth(authOptions);
export default handler;