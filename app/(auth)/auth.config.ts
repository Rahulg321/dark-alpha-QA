import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getUserByEmail } from "@/lib/db/queries";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";

export const authConfig = {
  pages: {
    signIn: "/login",
    newUser: "/",
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
    Credentials({
      authorize: async (credentials) => {
        console.log("inside authorize", credentials);

        const { email, password } = credentials;
        const user = await getUserByEmail(email as string);

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
          process.env.JWT_SECRET as string
        );

        console.log("created an accessToken", accessToken);

        return { ...user, type: "regular", accessToken };
      },
    }),
  ],
  callbacks: {},
} satisfies NextAuthConfig;
