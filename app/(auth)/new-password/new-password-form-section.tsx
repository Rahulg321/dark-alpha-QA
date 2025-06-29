"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useActionState, useEffect, useState } from "react";
import {
  newPasswordVerification,
  NewPasswordVerificationActionState,
} from "../actions";
import { NewPasswordForm } from "@/components/forms/new-password-form";
import { SubmitButton } from "@/components/submit-button";
import Link from "next/link";
import { useSession } from "next-auth/react";

import { toast } from "@/components/toast";

const NewPasswordFormSection = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isSuccessful, setIsSuccessful] = useState(false);
  const router = useRouter();

  const [state, formAction] = useActionState<
    NewPasswordVerificationActionState,
    FormData
  >(newPasswordVerification, {
    status: "idle",
  });

  useEffect(() => {
    if (state.status === "failed") {
      toast({
        type: "error",
        description: "Failed to reset password!",
      });
    } else if (state.status === "invalid_data") {
      toast({
        type: "error",
        description: "Failed to reset password!",
      });
    } else if (state.status === "user_not_found") {
      toast({
        type: "error",
        description: "The user was not found!",
      });
    } else if (state.status === "success") {
      setIsSuccessful(true);
      toast({
        type: "success",
        description:
          "Password reset successfully! You can now login with your new password.",
      });
      router.push("/login");
    } else if (state.status === "invalid_token") {
      toast({
        type: "error",
        description: "The token is invalid!",
      });
    } else if (state.status === "expired_token") {
      toast({
        type: "error",
        description: "The token has expired!",
      });
    }
  }, [state.status, router]);

  const handleSubmit = (formData: FormData) => {
    formData.set("token", token as string);
    formAction(formData);
  };

  return (
    <NewPasswordForm action={handleSubmit}>
      <SubmitButton isSuccessful={isSuccessful}>
        {state.status === "in_progress" ? "Saving..." : "Save"}
      </SubmitButton>
      <div className="mt-4 text-center text-sm">
        <Link
          href="/login"
          className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
        >
          Back to login
        </Link>
      </div>
    </NewPasswordForm>
  );
};

export default NewPasswordFormSection;
