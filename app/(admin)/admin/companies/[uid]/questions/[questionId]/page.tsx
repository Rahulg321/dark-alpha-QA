import { getCompanyQuestionById } from "@/lib/db/queries";
import React from "react";

const QuestionPage = async ({
  params,
}: {
  params: Promise<{ uid: string; questionId: string }>;
}) => {
  const { uid, questionId } = await params;

  const question = await getCompanyQuestionById(questionId);

  if (!question) {
    return <div>Question not found</div>;
  }

  return (
    <div className="block-space big-container">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">{question.title}</h1>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">Answers</h2>
      </div>
    </div>
  );
};

export default QuestionPage;
