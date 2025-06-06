import React from "react";
import ResourceEditForm from "./ResourceEditForm";

const EditResourcePage = async ({
  params,
}: {
  params: Promise<{ uid: string; resourceId: string }>;
}) => {
  const { uid, resourceId } = await params;

  return (
    <div className="block-space-mini narrow-container">
      <ResourceEditForm resourceId={resourceId} companyId={uid} />
    </div>
  );
};

export default EditResourcePage;
