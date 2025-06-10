import { compare } from "bcrypt-ts";
import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { createGuestUser, getUser } from "../../lib/db/queries";
import { authConfig } from "./auth.config";
import { DUMMY_PASSWORD } from "../../lib/constants";
import type { DefaultJWT } from "next-auth/jwt";
import { sign } from "jsonwebtoken";

export type UserType = "guest" | "regular";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      type: UserType;
      accessToken: string;
    } & DefaultSession["user"];
    accessToken: string;
  }

  interface User {
    id?: string;
    email?: string | null;
    type: UserType;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    type: UserType;
    accessToken: string;
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {},
      async authorize({ email, password }: any) {
        const users = await getUser(email);

        if (users.length === 0) {
          await compare(password, DUMMY_PASSWORD);
          return null;
        }

        const [user] = users;

        if (!user.password) {
          await compare(password, DUMMY_PASSWORD);
          return null;
        }

        const passwordsMatch = await compare(password, user.password);

        if (!passwordsMatch) return null;

        console.log("calling access token");
        const accessToken = sign(
          { id: user.id, type: "regular" },
          process.env.AUTH_SECRET as string
        );

        console.log("accessToken", accessToken);

        return { ...user, type: "regular", accessToken };
      },
    }),
    Credentials({
      id: "guest",
      credentials: {},
      async authorize() {
        const [guestUser] = await createGuestUser();
        return { ...guestUser, type: "guest", accessToken: "" };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.type = user.type;
        token.accessToken = user.accessToken as string;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.type = token.type;
      }

      session.accessToken = token.accessToken;

      return session;
    },
  },
});
