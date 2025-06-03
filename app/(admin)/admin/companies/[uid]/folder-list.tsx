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
import { getResourcesByFolder, getCompanyForFolder, getFolderNameById } from "@/lib/db/queries";
import DeleteCompanyButton from "./delete-company-button";
import ResourceCard from "./resource-card";

const FolderList = async (folderId: string) => {
  const resources = await getResourcesByFolder(folderId.folderId);
  const company = await getCompanyForFolder(folderId.folderId);
  const folderName = await getFolderNameById(folderId.folderId);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 md:px-6 max-w-7xl">

        <div className="space-y-6">

              <h4>{folderName}</h4>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {resources.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resourceId={resource.id}
                    resourceName={resource.name}
                    resourceDescription={resource.description ?? ""}
                    resourceKind={resource.kind}
                    companyId={company.id}
                  />
                ))}
              </div>
        </div>
      </div>
    </div>
  );
};

export default FolderList;
