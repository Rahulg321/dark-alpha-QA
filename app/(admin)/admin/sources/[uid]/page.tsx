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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default async function SourceDetail({
  params,
}: {
  params: Promise<{ uid: string }>;
}) {
  const { uid } = await params;

  const source = {
    id: Number.parseInt(uid),
    name:
      uid === "1"
        ? "Acme Corporation"
        : uid === "2"
        ? "TechStart Inc."
        : "Global Solutions",
    type: uid === "1" ? "Enterprise" : uid === "2" ? "Startup" : "Consultancy",
    description:
      "Acme Corporation is a global leader in innovative solutions for various industries. With cutting-edge technology and a commitment to excellence, Acme has established itself as a trusted partner for businesses worldwide. Their comprehensive suite of products and services addresses complex challenges and drives sustainable growth.",
    website: "https://example.com",
    contactEmail: "contact@example.com",
    createdAt: "May 15, 2023",
    updatedAt: "December 3, 2023",
  };

  const resources = [
    {
      id: 1,
      title: "Annual Report 2023",
      description:
        "Comprehensive financial and operational overview for the fiscal year 2023 including key metrics and strategic initiatives.",
      type: "PDF",
      size: "2.4 MB",
      updatedAt: "Dec 1, 2023",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      id: 2,
      title: "Product Catalog",
      description:
        "Complete catalog of products with detailed specifications, pricing information, and availability status.",
      type: "PDF",
      size: "5.1 MB",
      updatedAt: "Nov 15, 2023",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      id: 3,
      title: "Company Logo",
      description:
        "High-resolution company logo in various formats for marketing materials and brand consistency.",
      type: "PNG",
      size: "0.5 MB",
      updatedAt: "Oct 22, 2023",
      icon: <ImageIcon className="h-5 w-5" />,
    },
    {
      id: 4,
      title: "Marketing Strategy",
      description:
        "Detailed marketing strategy document outlining goals, tactics, and key performance indicators for Q1 2024.",
      type: "DOCX",
      size: "1.8 MB",
      updatedAt: "Dec 5, 2023",
      icon: <File className="h-5 w-5" />,
    },
    {
      id: 5,
      title: "Brand Guidelines",
      description:
        "Official brand guidelines including color palette, typography, logo usage, and visual identity standards.",
      type: "PDF",
      size: "3.2 MB",
      updatedAt: "Sep 30, 2023",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      id: 6,
      title: "Financial Projections",
      description:
        "Five-year financial projections with detailed revenue forecasts and expense planning.",
      type: "XLSX",
      size: "1.2 MB",
      updatedAt: "Nov 28, 2023",
      icon: <File className="h-5 w-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 md:px-6 max-w-7xl">
        <Link
          href="/admin/sources"
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sources
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
                    {source.name}
                  </h1>
                  <Badge variant="secondary">{source.type}</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Created {source.createdAt}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/sources/${source.id}/edit`}>
                <Button variant="outline">Edit Source</Button>
              </Link>
              <Button variant="destructive">Delete Source</Button>
            </div>
          </header>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-6">
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
                      {source.description}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-3">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground font-medium">
                          Website
                        </dt>
                        <dd>
                          <a
                            href={source.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-foreground hover:underline inline-flex items-center gap-1"
                          >
                            {source.website}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground font-medium">
                          Contact
                        </dt>
                        <dd>
                          <a
                            href={`mailto:${source.contactEmail}`}
                            className="text-foreground hover:underline"
                          >
                            {source.contactEmail}
                          </a>
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground font-medium">
                          Created
                        </dt>
                        <dd className="text-foreground">{source.createdAt}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground font-medium">
                          Updated
                        </dt>
                        <dd className="text-foreground">{source.updatedAt}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="resources" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-tight">
                  Resources
                </h2>
                <Link href={`/admin/sources/${source.id}/resources/new`}>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Resource
                  </Button>
                </Link>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {resources.map((resource) => (
                  <Card
                    key={resource.id}
                    className="group hover:shadow-md transition-all duration-200"
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                          {resource.icon}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <h3 className="font-semibold mb-2">{resource.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
                        {resource.description}
                      </p>
                      <div className="flex items-center justify-between text-xs">
                        <Badge variant="secondary">{resource.type}</Badge>
                        <span className="text-muted-foreground">
                          {resource.size}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
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
