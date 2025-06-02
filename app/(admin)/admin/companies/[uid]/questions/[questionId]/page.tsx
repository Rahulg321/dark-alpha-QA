import { getCompanyQuestionById } from "@/lib/db/queries";
import React from "react";
import AddAnswerDialog from "./add-answer-dialog";
import GenerateAnswerSection from "./generate-answer-section";

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
    <div className="block-space-mini big-container">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Answers</h2>
            <p>{question.title}</p>
          </div>
          <div className="border rounded-lg p-4">
            {/* Answers list will go here */}
          </div>
        </div>

        {/* AI Analysis Section */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">AI Analysis</h2>
          <div className="border rounded-lg p-4">
            <GenerateAnswerSection
              questionText={question.title}
              companyId={question.companyId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionPage;
