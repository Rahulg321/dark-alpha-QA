"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { Button } from "../ui/button";
import { toast } from "../toast";
import { newVerification } from "@/lib/actions/new-verification";

const NewVerificationForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const onSubmit = useCallback(async () => {
    if (success || error) {
      return;
    }

    if (!token) {
      setError("The verification token is missing or invalid.");
      return;
    }

    try {
      console.log("checking verification token", token);
      const res = await newVerification(token);
      console.log("res", res);
      if (res.status === "success") {
        setSuccess("Your email has been successfully verified.");
      } else if (res.status === "invalid_token") {
        setError("The verification token is invalid.");
      } else if (res.status === "expired_token") {
        setError("The verification token has expired.");
      } else if (res.status === "user_not_found") {
        setError("The user was not found.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    }
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <div className="w-full sm:px-16 px-4 flex flex-col justify-center gap-4">
      <div className="flex items-center w-full justify-center">
        {!success && !error && <BeatLoader />}
      </div>
      {success && (
        <div className="bg-green-100 dark:bg-green-900/50 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-md text-center">
          <p>{success}</p>
        </div>
      )}
      {error && (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive dark:text-red-400 text-center">
          <p>{error}</p>
        </div>
      )}
      <div className="flex flex-col items-center justify-center gap-4">
        <Button asChild className="w-full">
          <Link href="/login">Back to login</Link>
        </Button>
      </div>
    </div>
  );
};

export default NewVerificationForm;
