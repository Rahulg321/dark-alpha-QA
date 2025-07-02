import React from "react";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Building2, Calendar, PlusCircle, Briefcase, Tag } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import { getFilteredCompaniesWithTypes } from "@/lib/db/queries";
import FilterCompanyType from "./filter-company-type";

export const metadata: Metadata = {
  title: "Dark Alpha QA - Companies",
  description: "Dark Alpha QA - Companies",
};

function formatLabel(value?: string) {
  if (!value) return "N/A";
  return value.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

function CompanyCards({
  companies,
}: {
  companies: {
    id: string;
    name: string;
    type: string;
    industry: string;
    createdAt: Date;
  }[];
}) {
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
              <span className="text-lg font-semibold text-foreground hover:text-primary transition-colors truncate">
                {company.name}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Tag className="h-3 w-3 text-muted-foreground" />
                <span className="font-medium">Industry:</span>
                <span>{formatLabel(company.industry)}</span>
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Briefcase className="h-3 w-3 text-muted-foreground" />
                <span className="font-medium">Type:</span>
                <span>{formatLabel(company.type)}</span>
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Calendar className="size-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Created {company.createdAt.toLocaleDateString()}
              </span>
            </div>
          </Link>
          <Link
            href={`/companies/${company.id}/edit`}
            className="self-end sm:self-auto"
          >
            <Button
              variant="ghost"
              size="icon"
              className="size-7 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
            >
              <MoreHorizontal className="size-4 text-muted-foreground" />
              <span className="sr-only">Edit company</span>
            </Button>
          </Link>
        </div>
      ))}
    </>
  );
}

const CompaniesPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { type } = await searchParams;
  const companies = await getFilteredCompaniesWithTypes(type);

  return (
    <div className="min-h-screen group">
      <div className="container mx-auto py-8 px-4 sm:px-6 md:px-8 max-w-screen-lg">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight mb-2">
            Companies
          </h1>
          <p className="text-muted-foreground">
            Manage your companies and their associated resources.
          </p>
        </header>

        <div className="flex items-center gap-2">
          <FilterCompanyType />
        </div>

        <div className="w-full sm:w-auto flex justify-start sm:justify-end mt-2 sm:mt-0">
          <Link href="/admin/companies/new" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">
              <PlusCircle className="mr-2 size-4" />
              New Company
            </Button>
          </Link>
        </div>

        <div className="flex flex-col gap-2 w-full group-has-[[data-pending]]:animate-pulse">
          <CompanyCards companies={companies} />
        </div>
      </div>
    </div>
  );
};

export default CompaniesPage;
