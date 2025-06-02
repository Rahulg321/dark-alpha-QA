import React from "react";
import { getCompanyQuestionById } from "@/lib/db/queries";
import AddAnswerForm from "./add-answer-form";

const AddAnswerPage = async ({
  params,
}: {
  params: Promise<{ uid: string; questionId: string }>;
}) => {
  const { uid, questionId } = await params;

  return (
    <div className="block-space big-container">
      <h1 className="text-2xl font-bold">Add Answer</h1>
      <AddAnswerForm companyId={uid} companyQuestionId={questionId} />
    </div>
  );
};

export default AddAnswerPage;
