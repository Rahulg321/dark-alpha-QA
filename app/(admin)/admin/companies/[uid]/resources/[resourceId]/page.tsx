import React from "react";

const DetailResourcePage = async ({
  params,
}: {
  params: Promise<{ uid: string; resourceId: string }>;
}) => {
  const { uid, resourceId } = await params;

  return (
    <div className="block-space-mini narrow-container">
      <ResourceDetail resourceId={resourceId} companyId={uid} />
    </div>
  );
};

export default DetailResourcePage;

const ResourceDetail = ({
  resourceId,
  companyId,
}: {
  resourceId: string;
  companyId: string;
}) => {
  return <div>ResourceDetail</div>;
};
