import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { db, getUser, getUserById } from "@/lib/db/queries";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { user as userTable } from "@/lib/db/schema";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/error",
    newUser: "/",
  },
  providers: [
    Google,
    Credentials({
      authorize: async (credentials) => {
        console.log("inside authorize", credentials);

        const { email, password } = credentials;
        const user = (await getUser(email as string))?.[0];

        if (!user || !user.password) {
          console.log("User not found or password is null");
          return null;
        }

        const passwordsMatch = await bcrypt.compare(
          password as string,
          user.password
        );

        if (!passwordsMatch) {
          console.log("Invalid password, they do not match");
          return null;
        }

        const accessToken = sign(
          { id: user.id, type: "regular" },
          process.env.AUTH_SECRET as string
        );

        console.log("created an accessToken", accessToken);

        return { ...user, type: "regular", accessToken };
      },
    }),
  ],
  // events: {
  //   async linkAccount({ user, account }) {
  //     console.log("linking account", user, account);
  //     await db
  //       .update(userTable)
  //       .set({
  //         emailVerified: new Date(),
  //       })
  //       .where(eq(userTable.id, user.id as string));
  //   },
  // },

  callbacks: {
    signIn: async ({ user, account }) => {
      if (account?.provider !== "credentials") {
        const existingUser = (await getUser(user.email as string))?.[0];
        if (existingUser && existingUser.password) {
          console.log(
            "User already has a password, created usingother provider"
          );
          return false;
        }

        if (user.id) {
          await db
            .update(userTable)
            .set({ emailVerified: new Date() })
            .where(eq(userTable.id, user.id));
        }
        return true;
      }

      const existingUser = await getUserById(user.id as string);

      if (!existingUser?.emailVerified) {
        return false;
      }

      return true;
    },

    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/admin");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        // return Response.redirect(new URL('/admin', nextUrl));
      }
      return true;
    },
    jwt({ token, user }) {
      console.log("inside jwt callback  ", token, user);

      if (user) {
        token.id = user.id as string;
        token.type = user.type;
        token.accessToken = user.accessToken as string;
      }

      return token;
    },
    session({ session, token }) {
      console.log("inside session callback  ", session, token);

      if (session.user) {
        session.user.id = token.id;
        session.user.type = token.type;
      }

      session.accessToken = token.accessToken as string;

      return session;
    },
  },
} satisfies NextAuthConfig;
