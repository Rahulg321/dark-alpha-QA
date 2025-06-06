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
  title: "Dark Alpha QA - Companies",
  description: "Dark Alpha QA - Companies",
};

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
        <div
          key={company.id}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-3 sm:px-6 py-3 hover:bg-muted/30 group transition-colors border-b rounded-md w-full"
        >
          <Link
            href={`/admin/companies/${company.id}`}
            className="flex-1 min-w-0 pr-0 sm:pr-3 block"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground hover:text-primary transition-colors truncate">
                {company.name}
              </span>
              <Badge variant="secondary" className="text-xs ml-2">
                {company.type}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {company.createdAt.toLocaleDateString()}
            </div>
          </Link>
          <Link
            href={`/companies/${company.id}/edit`}
            className="self-end sm:self-auto"
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
            >
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              <span className="sr-only">Edit company</span>
            </Button>
          </Link>
        </div>
      ))}
    </>
  );
}

const CompaniesPage = async () => {
  const companies = await getCompanies();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 sm:px-6 md:px-8 max-w-screen-lg">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight mb-2">
            Companies
          </h1>
          <p className="text-muted-foreground">
            Manage your companies and their associated resources.
          </p>
        </header>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 w-full">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <Button variant="secondary" size="sm">
              All
            </Button>
            <Button variant="ghost" size="sm">
              Enterprise
            </Button>
            <Button variant="ghost" size="sm">
              Agency
            </Button>
            <Button variant="ghost" size="sm">
              Research
            </Button>
            <Button variant="ghost" size="sm">
              Other
            </Button>
            <Button variant="ghost" size="sm">
              Consultancy
            </Button>
          </div>
          <div className="w-full sm:w-auto flex justify-start sm:justify-end mt-2 sm:mt-0">
            <Link href="/admin/companies/new" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Company
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <CompanyCards companies={companies} />
        </div>
      </div>
    </div>
  );
};

export default CompaniesPage;
