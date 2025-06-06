import React from "react";
import ResourceEditForm from "./ResourceEditForm";
import {
  getAllResourceCategories,
  getAllResourceCategoriesNameAndId,
  getResourceById,
} from "@/lib/db/queries";

const EditResourcePage = async ({
  params,
}: {
  params: Promise<{ uid: string; resourceId: string }>;
}) => {
  const { uid, resourceId } = await params;
  const resource = await getResourceById(resourceId);
  const resourceCategories = await getAllResourceCategories();

  if (!resource) {
    return <div>Resource not found</div>;
  }

  return (
    <div className="block-space-mini narrow-container min-h-screen">
      <h1 className="text-2xl font-bold">Edit Resource {resource.name}</h1>

      <ResourceEditForm
        resource={resource}
        companyId={uid}
        resourceCategories={resourceCategories}
      />
    </div>
  );
};

export default EditResourcePage;
