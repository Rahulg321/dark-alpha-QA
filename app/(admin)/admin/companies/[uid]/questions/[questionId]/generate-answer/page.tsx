import React from "react";
import { Button } from "@/components/ui/button";
import GenerateAnswerSection from "./generate-answer-section";
import { getCompanyQuestionById } from "@/lib/db/queries";
import { notFound } from "next/navigation";

const GenerateAnswerPage = async ({
  params,
}: {
  params: { uid: string; questionId: string };
}) => {
  const { uid, questionId } = params;

  const question = await getCompanyQuestionById(questionId);

  if (!question) {
    return notFound();
  }

  return (
    <div className="big-container block-space">
      <h1 className="text-2xl font-bold">Generate Answer</h1>
      <p className="text-sm text-muted-foreground">
        Generate an answer for the question.
      </p>
      <GenerateAnswerSection
        question={question?.title ?? ""}
        companyId={uid}
        questionId={questionId}
      />
    </div>
  );
};

export default GenerateAnswerPage;
