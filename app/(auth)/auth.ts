import NextAuth from "next-auth";
import { db } from "@/lib/db/queries";
import { authConfig } from "./auth.config";
import { DUMMY_PASSWORD } from "@/lib/constants";
import { sign } from "jsonwebtoken";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { accounts, sessions, user } from "@/lib/db/schema";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: user,
    accountsTable: accounts,
    sessionsTable: sessions,
  }),
  session: { strategy: "jwt" },
  ...authConfig,
  providers: [...authConfig.providers],
});
