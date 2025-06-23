import NextAuth from "next-auth";
import { authConfig } from "./app/(auth)/auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  AUTH_ROUTES,
  PUBLIC_ROUTES,
  PROTECTED_BASE_ROUTES,
} from "./routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;

  const isLoggedIn = !!req.auth;

  const isProtectedRoute = PROTECTED_BASE_ROUTES.some((route) =>
    nextUrl.pathname.startsWith(route)
  );
  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);
  const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname);

  if (isProtectedRoute && !isLoggedIn) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  if (isAuthRoute && isLoggedIn) {
    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  if (isPublicRoute) {
    return;
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
