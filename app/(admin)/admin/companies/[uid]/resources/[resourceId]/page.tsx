import { getResourceWithCategoryById } from "@/lib/db/queries";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";

const DetailResourcePage = async ({
  params,
}: {
  params: Promise<{ uid: string; resourceId: string }>;
}) => {
  const { uid, resourceId } = await params;
  const resource = await getResourceWithCategoryById(resourceId);

  if (!resource) {
    return <div>Resource not found</div>;
  }

  return (
    <div className="block-space-mini narrow-container min-h-screen">
      <div>
        <Link className="block" href={`/admin/companies/${uid}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="size-4 mr-2" />
            Back to Resources
          </Button>
        </Link>
      </div>
      <div className="flex items-center justify-between my-6">
        <h1 className="text-2xl font-bold">Resource {resource.name}</h1>
        <Link href={`/admin/companies/${uid}/resources/${resourceId}/edit`}>
          <Button variant="outline" size="sm">
            <Pencil className="size-4 mr-2" />
            Edit Resource
          </Button>
        </Link>
      </div>

      <ResourceDetail
        resourceId={resourceId}
        companyId={uid}
        resource={resource}
      />
    </div>
  );
};

export default DetailResourcePage;

const ResourceDetail = ({
  resourceId,
  companyId,
  resource,
}: {
  resourceId: string;
  companyId: string;
  resource: {
    id: string;
    name: string;
    categoryId: string | null;
    tags: string[] | null;
    description: string | null;
    kind: string;
    createdAt: Date;
    categoryName: string | null;
  };
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resource Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
            <p className="mt-1">{resource.name}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Description
            </h3>
            <p className="mt-1 whitespace-pre-wrap">{resource.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Category
            </h3>
            <p className="mt-1">{resource.categoryName ?? "No category"}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Created At
            </h3>
            <p className="mt-1">{resource.createdAt.toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
