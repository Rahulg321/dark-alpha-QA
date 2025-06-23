import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Error",
  description: "Error",
};

const ErrorPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { error, message } = await searchParams;

  console.log("error", error);
  if (error === "AccessDenied") {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1>Access Denied</h1>
        <p>
          You are not authorized to access this page. Please contact support.
        </p>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/">Go back to the home page</Link>
          </Button>
          <Button asChild>
            <Link href="/login">Login Again</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>Error</h1>
      <p>Error Occured while trying to login</p>
      <Button asChild>
        <Link href="/">Go back to the home page</Link>
      </Button>
      <Button asChild>
        <Link href="/login">Login Again</Link>
      </Button>
    </div>
  );
};

export default ErrorPage;
