"use server";

import { ResetPasswordEmail } from "@/components/emails/reset-password";
import TokenVerificationEmail from "@/components/emails/token-verification-email";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends a verification token email to the user.
 * @param email - The email to send the verification token to.
 * @param token - The verification token to send to the user.
 */
export const sendVerificationTokenEmail = async (
  email: string,
  token: string
) => {
  const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL}/new-verification?token=${token}`;

  console.log("confirmLink", confirmLink);

  const { data, error } = await resend.emails.send({
    from: `Dark Alpha Capital <info@darkalphacapital.com>`,
    to: [email],
    subject: "Verify your account",
    react: await TokenVerificationEmail({
      tokenConfirmLink: confirmLink,
    }),
  });

  console.log("sending verification token email", data, error);

  if (error) {
    console.log("error sending email", error.name, error.message);
    return {
      error: `could not send email -> ${error.message}}`,
    };
  }

  return {
    success: true,
  };
};

/**
 * Sends a password reset email to the user.
 * @param email - The email to send the password reset email to.
 * @param token - The password reset token to send to the user.
 */
export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/new-password?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: `Dark Alpha Capital <info@darkalphacapital.com>`,
    to: [email],
    subject: "Reset your Password",
    react: await ResetPasswordEmail({
      resetPasswordLink: resetLink,
    }),
  });

  if (error) {
    console.log("error sending email", error.name, error.message);
    return {
      error: `could not send email -> ${error.message}}`,
    };
  }
};
