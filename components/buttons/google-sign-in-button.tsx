import React from "react";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa6";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

const SigninGoogle = () => {
  return (
    <div>
      <Button
        variant={"outline"}
        type="submit"
        onClick={() => {
          signIn("google", { callbackUrl: DEFAULT_LOGIN_REDIRECT });
        }}
        className="w-full cursor-pointer"
      >
        <FaGoogle className="mr-2 size-4" /> Sign in With Google
      </Button>
    </div>
  );
};

export default SigninGoogle;
