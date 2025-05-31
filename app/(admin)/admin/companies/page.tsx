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
import { getCompanies } from "@/lib/db/queries";
import { Company } from "@/lib/db/schema";

export const metadata: Metadata = {
  title: "Admin",
  description: "Admin page",
};

const CompaniesPage = async () => {
  const companies = await getCompanies();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 md:px-6 max-w-7xl">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight mb-2">
            Companies
          </h1>
          <p className="text-muted-foreground">
            Manage your companies and their associated resources.
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
          <Link href="/admin/companies/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Company
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <CompanyCards companies={companies} />
        </div>
      </div>
    </div>
  );
};

export default CompaniesPage;

function CompanyCards({ companies }: { companies: Company[] }) {
  if (companies.length === 0) {
    return (
      <Card className="col-span-full">
        <CardContent className="p-6 text-center">
          <div className="flex flex-col items-center justify-center gap-2">
            <Building2 className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold">No companies found</h3>
            <p className="text-sm text-muted-foreground">
              Get started by creating your first company
            </p>
            <Link href="/admin/companies/new">
              <Button className="mt-2">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Company
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {companies.map((company) => (
        <Card
          key={company.id}
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
                    {company.type}
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
                  <Link href={`/companies/${company.id}/edit`}>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem className="text-destructive">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Link
              href={`/admin/companies/${company.id}`}
              className="block group"
            >
              <h3 className="font-semibold text-lg mb-2 group-hover:text-foreground/80 transition-colors">
                {company.name}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
                {company.description}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{company.createdAt.toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
