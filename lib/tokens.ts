import { v4 as uuidv4 } from "uuid";
import {
  db,
  getPasswordResetTokenByEmail,
  getVerificationTokenByEmail,
} from "./db/queries";
import { passwordResetToken, verificationToken } from "./db/schema";
import { eq } from "drizzle-orm";

/**
 * Generates a verification token for the given email.
 * @param email - The email to generate a verification token for.
 * @returns The verification token and the expiration date.
 */
export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();

  // 1 hour
  const expires = new Date(Date.now() + 1000 * 60 * 60);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db
      .delete(verificationToken)
      .where(eq(verificationToken.email, email));
  }

  const [newVerificationToken] = await db
    .insert(verificationToken)
    .values({
      email,
      token,
      expires,
    })
    .returning();

  return newVerificationToken;
};

/**
 * Generates a password reset token for the given email.
 * @param email - The email to generate a password reset token for.
 * @returns The password reset token and the expiration date.
 */
export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(Date.now() + 1000 * 60 * 60);
  const existingToken = await getPasswordResetTokenByEmail(email);
  if (existingToken) {
    await db
      .delete(passwordResetToken)
      .where(eq(passwordResetToken.email, email));
  }

  const [newPasswordResetToken] = await db
    .insert(passwordResetToken)
    .values({
      email,
      token,
      expires,
    })
    .returning();

  return newPasswordResetToken;
};
