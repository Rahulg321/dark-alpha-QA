import { verify } from "../actions";
import React from "react";

type SearchParams = Promise<{ [key: string]: string | undefined }>;

const VerifyUserPage = async (props: { searchParams: SearchParams}) => {
  const data = await props.searchParams
  const userId = data.userId;
  const verificationToken = data.verificationToken;

  if (await verify(userId, verificationToken)) {
    return (
      <h1>
      user verified
      </h1>
    );
  } else {
    return (
      <h1>
      failed to verify user
      </h1>
    );
  }
}

export default VerifyUserPage;
