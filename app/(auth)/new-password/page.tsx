import NewPasswordFormSection from "./new-password-form-section";
import { getPasswordResetTokenByToken } from "@/lib/db/queries";
import Image from "next/image";
import Link from "next/link";
import React, { Suspense } from "react";

const ResetPasswordPage = async (props: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const searchParams = await props.searchParams;
  const paramsToken = searchParams?.token;
  let dbToken;

  if (paramsToken) {
    dbToken = await getPasswordResetTokenByToken(paramsToken as string);
  }

  if (!dbToken) {
    return (
      <section className="block-space container relative">
        <div className="mt-8 text-center">
          <h1 className="mb-2 text-2xl font-semibold">Reset Your Password</h1>
          <p className="mb-4 text-gray-600">Enter your updated password</p>
          <p className="mb-6 text-red-600">
            The token is invalid or has expired. Please request a new password
            reset link.
          </p>
          <Link href="/reset-password">Request New Password Reset</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="block-space container">
      <div className="space-y-2">
        <h2>Set up a new Password</h2>
        <h3 className="">
          Email:- <span className="text-baseC">{dbToken.email}</span>
        </h3>
        <p>Enter your new password below.</p>
      </div>
      <NewPasswordFormSection />
    </section>
  );
};

export default ResetPasswordPage;
