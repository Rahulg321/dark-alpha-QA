import NewQuestionForm from "./new-question-form";

const NewCompanyQuestionPage = async ({
  params,
}: {
  params: Promise<{ uid: string }>;
}) => {
  const { uid } = await params;
  return <NewQuestionForm companyId={uid} />;
};

export default NewCompanyQuestionPage;
