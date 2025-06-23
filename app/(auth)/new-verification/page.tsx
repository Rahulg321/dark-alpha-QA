import NewVerificationForm from "@/components/forms/new-verification-form";
import { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "New Verification",
  description: "Verify your email address",
};

const NewVerificationPage = () => {
  return (
    <div className="flex h-dvh w-screen items-start pt-12 md:pt-0 md:items-center justify-center bg-background">
      <div className="w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-6">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h3 className="text-xl font-semibold dark:text-zinc-50">
            Confirming your verification
          </h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Once your email is verified, you can sign in to your account.
          </p>
        </div>
        <Suspense>
          <NewVerificationForm />
        </Suspense>
      </div>
    </div>
  );
};

export default NewVerificationPage;
