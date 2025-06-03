import { Metadata } from "next";
import BulkUploadForm from "./bulk-upload-form";

export const metadata: Metadata = {
  title: "Bulk Upload Questions",
  description: "Bulk upload questions for a company",
};

const BulkUploadQuestionsPage = async ({
  params,
}: {
  params: Promise<{ uid: string }>;
}) => {
  const { uid } = await params;

  return (
    <div>
      <BulkUploadForm companyId={uid} />
    </div>
  );
};

export default BulkUploadQuestionsPage;
