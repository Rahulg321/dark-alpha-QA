import React from "react";
import CompareSection from "./compare-section";
import { db, getResourcesByCompanyId } from "@/lib/db/queries";
import { company, resources } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/app/(auth)/auth";
import { Session } from "next-auth";
import { redirect } from "next/navigation";

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

  const userSession = await auth();

  if (!userSession) {
    return redirect("/login");
  }

  const allCompanyResources = await getResourcesByCompanyId(uid);

  if (!allCompanyResources) {
    return <div>No resources found</div>;
  }

  return (
    <div className="block-space-mini min-h-screen container mx-auto">
      <CompareSection
        companyId={uid}
        resources={allCompanyResources}
        session={userSession as Session}
      />
    </div>
  );
};

export default CompareCompanyResourcesPage;
