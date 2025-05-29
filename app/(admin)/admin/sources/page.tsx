import React from "react";
import NewResourceForm from "@/components/forms/new-resource-form";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Building2, Calendar, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin",
  description: "Admin page",
};

const SourcesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 md:px-6 max-w-7xl">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight mb-2">
            Sources
          </h1>
          <p className="text-muted-foreground">
            Manage your sources and their associated resources.
          </p>
        </header>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm">
              All
            </Button>
            <Button variant="ghost" size="sm">
              Enterprise
            </Button>
            <Button variant="ghost" size="sm">
              Startup
            </Button>
            <Button variant="ghost" size="sm">
              Consultancy
            </Button>
          </div>
          <Link href="/sources/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Source
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <SourceCards />
        </div>
      </div>
    </div>
  );
};

export default SourcesPage;
function SourceCards() {
  const sources = [
    {
      id: 1,
      name: "Acme Corporation",
      description:
        "Global leader in innovative solutions for various industries with cutting-edge technology and comprehensive services.",
      type: "Enterprise",
      resourceCount: 12,
      createdAt: "May 15, 2023",
    },
    {
      id: 2,
      name: "TechStart Inc.",
      description:
        "Emerging technology startup focused on AI-driven solutions for small businesses and digital transformation.",
      type: "Startup",
      resourceCount: 5,
      createdAt: "Jun 22, 2023",
    },
    {
      id: 3,
      name: "Global Solutions",
      description:
        "International consultancy firm specializing in business transformation and strategic planning.",
      type: "Consultancy",
      resourceCount: 8,
      createdAt: "Jul 10, 2023",
    },
    {
      id: 4,
      name: "Innovate Labs",
      description:
        "Research and development laboratory creating next-generation products for healthcare industry.",
      type: "Research",
      resourceCount: 15,
      createdAt: "Aug 5, 2023",
    },
    {
      id: 5,
      name: "Digital Frontiers",
      description:
        "Digital transformation experts helping businesses adapt to modern technological landscapes.",
      type: "Consultancy",
      resourceCount: 7,
      createdAt: "Sep 18, 2023",
    },
  ];

  return (
    <>
      {sources.map((source) => (
        <Card
          key={source.id}
          className="group hover:shadow-md transition-all duration-200 border-border"
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <Badge variant="secondary" className="mb-2 text-xs">
                    {source.type}
                  </Badge>
                </div>
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
                  <Link href={`/sources/${source.id}/edit`}>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem className="text-destructive">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Link href={`/admin/sources/${source.id}`} className="block group">
              <h3 className="font-semibold text-lg mb-2 group-hover:text-foreground/80 transition-colors">
                {source.name}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
                {source.description}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{source.createdAt}</span>
                </div>
                <span>{source.resourceCount} resources</span>
              </div>
            </Link>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
