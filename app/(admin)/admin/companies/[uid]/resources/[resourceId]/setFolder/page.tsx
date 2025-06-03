import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  PlusCircle,
  ExternalLink,
  Calendar,
  FileText,
  ImageIcon,
  File,
  MoreHorizontal,
  Building2,
  MessageCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCompanyById, getFoldersByCompanyId } from "@/lib/db/queries";
import DeleteCompanyButton from "./../../../delete-company-button.tsx";
import FolderCard from "./folder-card";

export default async function SetFolder({
  params,
}: {
  params: Promise<{ uid: string, resourceId: string }>;
}) {
  const { uid, resourceId } = await params;

  const company = await getCompanyById(uid);
  const folders = await getFoldersByCompanyId(uid);

  return (
    <div className="min-h-screen bg-background">
    <div className="container mx-auto py-8 px-4 md:px-6 max-w-7xl">
    <Link
    href="/admin/companies"
    className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
    >
    <ArrowLeft className="mr-2 h-4 w-4" />
    Back to Companies
    </Link>

    <div className="space-y-6">
    <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
    <div className="flex items-center gap-4">
    <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
    <Building2 className="h-6 w-6 text-muted-foreground" />
    </div>
    <div>
    <div className="flex items-center gap-3 mb-1">
    <h1 className="text-2xl font-semibold tracking-tight">
    {company.name}
    </h1>
    <Badge variant="secondary">{company.type}</Badge>
    </div>
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
    <Calendar className="h-3.5 w-3.5" />
    <span>Created {company.createdAt.toLocaleDateString()}</span>
    </div>
    </div>
    </div>
    </header>
    <div className="flex items-center justify-between">
    <h2 className="text-xl font-semibold tracking-tight">
    Folders
    </h2>
    <Link href={`/admin/companies/${company.id}/resources/${resourceId}/setFolder/new`}>
    <Button>
    <PlusCircle className="mr-2 h-4 w-4" />
    Add Folder
    </Button>
    </Link>
    </div>

    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
    {folders.map((folder) => (
      <FolderCard
      key={folder.id}
      name={folder.name}
      documentId={resourceId}
      companyId={company.id}
      />
    ))}
    </div>
    </div>
    </div>
    </div>
  );
}
