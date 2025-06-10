import React from "react";
import CompareSection from "./compare-section";
import { db, getResourcesByCompanyId } from "@/lib/db/queries";
import { company, resources } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import CompareSelectionResult from "./compare-selection-result";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ uid: string }>;
}) => {
  const { uid } = await params;
  const [foundCompany] = await db
    .select({
      companyName: company.name,
    })
    .from(company)
    .where(eq(company.id, uid));

  return {
    title: `${foundCompany.companyName} - Compare Resources`,
    description: `Compare resources for ${foundCompany.companyName}`,
  };
};

const CompareCompanyResourcesPage = async ({
  params,
}: {
  params: Promise<{ uid: string }>;
}) => {
  const { uid } = await params;

  const allCompanyResources = await db
    .select()
    .from(resources)
    .where(eq(resources.companyId, uid));

  if (!allCompanyResources) {
    return <div>No resources found</div>;
  }

  return (
    <div className="block-space-mini min-h-screen narrow-container">
      <CompareSection resources={allCompanyResources} />
      <CompareSelectionResult />
    </div>
  );
};

export default CompareCompanyResourcesPage;
