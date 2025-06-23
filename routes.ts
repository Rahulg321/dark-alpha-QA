/**
 *
 *These are the routes that are used for authentication purposes
 *@type{string}
 */
export const AUTH_ROUTES = [
  "/login",
  "/signup",
  "/auth/reset",
  "/auth/error",
  "/auth/new-password",
  "/auth/verify-email",
  "/auth/verify-email-token",
  "/auth/verify-email-token-success",
  "/auth/verify-email-token-expired",
  "/auth/verify-email-token-expired-error",
];

/**
 *
 *These are the routes that are protected and user cant access without being logged in
 *@type{string}
 */
export const PROTECTED_ROUTES = [
  "/dashboard",
  "/history",
  "/notifications",
  "/profile",
  "/settings",
];

export const PROTECTED_BASE_ROUTES = ["/dashboard", "/admin"];

/**
 *
 *This is default login redirect that the user will go to after successful login and registration
 *@type{string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/";

export const PUBLIC_ROUTES = ["/", "/new-password", "/new-verification"];

// export const PUBLIC_ROUTES = [""];
// export const PUBLIC_ROUTES = [""];
