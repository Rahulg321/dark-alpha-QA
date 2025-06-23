import NewPasswordFormSection from "./new-password-form-section";
import { getPasswordResetTokenByToken } from "@/lib/db/queries";
import Link from "next/link";

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
      <div className="flex h-dvh w-screen items-start pt-12 md:pt-0 md:items-center justify-center bg-background">
        <div className="w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-6">
          <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
            <h3 className="text-xl font-semibold dark:text-zinc-50">
              Invalid Token
            </h3>
            <p className="text-sm text-gray-500 dark:text-zinc-400">
              The token is invalid or has expired. Please request a new password
              reset link.
            </p>
          </div>
          <div className="px-4 sm:px-16 pb-12 text-center">
            <Link
              href="/reset-password"
              className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
            >
              Request New Password Reset
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-dvh w-screen items-start pt-12 md:pt-0 md:items-center justify-center bg-background">
      <div className="w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-12">
        <div className="flex flex-col items-center justify-center gap-2 px-4 pt-12 text-center sm:px-16">
          <h3 className="text-xl font-semibold dark:text-zinc-50">
            Set up a new Password
          </h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Enter your new password below for {dbToken.email}.
          </p>
        </div>
        <div className="px-4 sm:px-16 pb-12">
          <NewPasswordFormSection />
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
