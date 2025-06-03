import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import NewFolderForm from "@/components/forms/new-folder-form";
import { getCompanyNameById } from "@/lib/db/queries";

export default async function NewFolder({
  params,
}: {
  params: Promise<{ uid: string, resourceId: string }>;
}) {
  const { uid, resourceId } = await params;
  const company = await getCompanyNameById(uid);

  return (
    <div className="min-h-screen bg-background">
    <div className="container mx-auto py-8 px-4 md:px-6 max-w-2xl">
    <Link
    href={`/admin/companies/${uid}`}
    className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
    >
    <ArrowLeft className="mr-2 h-4 w-4" />
    Back to Company Details
    </Link>

    <Card>
    <CardHeader className="space-y-1">
    <CardTitle className="text-xl">
    Add New Folder to {company?.name ?? "Company"}
    </CardTitle>
    </CardHeader>
    <CardContent>
    <NewFolderForm companyId={uid} resourceId={resourceId} />
    </CardContent>
    </Card>
    </div>
    </div>
  );
}
