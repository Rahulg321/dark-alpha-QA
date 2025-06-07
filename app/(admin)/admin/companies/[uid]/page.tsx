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
import {
  getAllResourceCategoriesNameAndId,
  getCompanyById,
  getResourcesWithCategoryByCompanyId,
} from "@/lib/db/queries";
import DeleteCompanyButton from "./delete-company-button";
import ResourceCard from "./resource-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ uid: string }>;
}) => {
  const { uid } = await params;
  const company = await getCompanyById(uid);
  return {
    title: `Company Name: ${company.name}`,
    description: `Company Description: ${company.description}`,
    openGraph: {
      title: `Company Name: ${company.name}`,
      description: `Company Description: ${company.description}`,
    },
  };
};

export default async function CompanyDetail({
  params,
}: {
  params: Promise<{ uid: string }>;
}) {
  const { uid } = await params;

  const company = await getCompanyById(uid);
  const resources = await getResourcesWithCategoryByCompanyId(uid);

  const resourceCategories = await getAllResourceCategoriesNameAndId();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 sm:px-6 md:px-8 max-w-screen-lg">
        <Link
          href="/admin/companies"
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
          aria-label="Back to Companies"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Companies
        </Link>

        <div className="space-y-6">
          <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1 min-w-0">
              <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Building2 className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl font-semibold tracking-tight truncate">
                    {company.name}
                  </h1>
                  <Badge variant="secondary" className="truncate max-w-xs">
                    {company.type}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Created {company.createdAt.toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Link
                href={`/admin/companies/${company.id}/questions`}
                className="w-full sm:w-auto"
              >
                <Button variant="outline" className="w-full sm:w-auto">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Questions
                </Button>
              </Link>
              <div className="flex gap-2 w-full sm:w-auto">
                <Link
                  href={`/admin/companies/${company.id}/edit`}
                  className="w-full sm:w-auto"
                >
                  <Button variant="outline" className="w-full sm:w-auto">
                    Edit Company
                  </Button>
                </Link>
                <DeleteCompanyButton companyId={company.id} />
              </div>
            </div>
          </header>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-6 overflow-x-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {company.description}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                        <dt className="text-muted-foreground font-medium">
                          Website
                        </dt>
                        <dd>
                          <a
                            href={company.website ?? ""}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-foreground hover:underline inline-flex items-center gap-1"
                            aria-label="Company website"
                          >
                            {company.website}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </dd>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                        <dt className="text-muted-foreground font-medium">
                          Contact
                        </dt>
                        <dd>
                          <a
                            href={`mailto:${company.email}`}
                            className="text-foreground hover:underline"
                            aria-label="Company email"
                          >
                            {company.email}
                          </a>
                        </dd>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                        <dt className="text-muted-foreground font-medium">
                          Created
                        </dt>
                        <dd className="text-foreground">
                          {company.createdAt.toLocaleDateString()}
                        </dd>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                        <dt className="text-muted-foreground font-medium">
                          Updated
                        </dt>
                        <dd className="text-foreground">
                          {company.updatedAt.toLocaleDateString()}
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="resources" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h2 className="text-xl font-semibold tracking-tight">
                  Resources
                </h2>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Select>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {resourceCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Link
                    href={`/admin/companies/${company.id}/resources/new-audio`}
                    className="w-full sm:w-auto"
                  >
                    <Button className="w-full sm:w-auto">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Audio Resource
                    </Button>
                  </Link>

                  <Link
                    href={`/admin/companies/${company.id}/compare`}
                    className="w-full sm:w-auto"
                  >
                    <Button className="w-full sm:w-auto">Compare</Button>
                  </Link>

                  <Link
                    href={`/admin/companies/${company.id}/resources/new`}
                    className="w-full sm:w-auto"
                  >
                    <Button className="w-full sm:w-auto">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Resource
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full">
                {resources.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resourceId={resource.id}
                    resourceName={resource.name}
                    resourceDescription={resource.description ?? ""}
                    resourceKind={resource.kind}
                    companyId={company.id}
                    categoryName={resource.categoryName ?? null}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Activity log will be displayed here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
