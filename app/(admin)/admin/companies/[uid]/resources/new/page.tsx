import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import NewResourceForm from "@/components/forms/new-resource-form";
import { getAllResourceCategories, getCompanyNameById } from "@/lib/db/queries";
import { auth } from "@/app/(auth)/auth";
import { redirect } from "next/navigation";

export default async function NewResource({
  params,
}: {
  params: Promise<{ uid: string }>;
}) {
  const userSession = await auth();

  if (!userSession) {
    redirect("/login");
  }

  const { uid } = await params;
  const company = await getCompanyNameById(uid);
  const resourceCategories = await getAllResourceCategories();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 md:px-6 max-w-2xl">
        <Link
          href={`/admin/companies/${uid}`}
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="size-4 mr-2" />
          Back to Company Details
        </Link>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">
              Add New Resource to {company?.name ?? "Company"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <NewResourceForm
              companyId={uid}
              resourceCategories={resourceCategories}
              session={userSession}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
