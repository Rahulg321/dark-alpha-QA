import React from "react";

const QuestionPage = async ({
  params,
}: {
  params: Promise<{ uid: string; questionId: string }>;
}) => {
  const { uid, questionId } = await params;

  return <div>QuestionPage</div>;
};

export default QuestionPage;
