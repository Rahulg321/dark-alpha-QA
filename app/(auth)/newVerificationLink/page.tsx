import { newVerificationLink } from "../actions";
import React from "react";

type SearchParams = Promise<{ [key: string]: string | undefined }>;

const VerifyUserPage = async (props: { searchParams: SearchParams}) => {
  const data = await props.searchParams
  const userEmail = data.email;

  newVerificationLink(userEmail);

  return (
    <h1>
    New Link Sent
    </h1>
  );
}

export default VerifyUserPage;
