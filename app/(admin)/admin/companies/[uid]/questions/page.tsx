import React from "react";
import Link from "next/link";
import {
  Plus,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getFilteredCompanyQuestionsByCompanyId,
} from "@/lib/db/queries";
import QuestionItem from "./question-item";
import SearchQuestionFilter from "./search-question-filter";
import { db } from "@/lib/db/queries";
import { eq, } from "drizzle-orm";
import { company } from "@/lib/db/schema";
import QuestionsPagination from "./questions-pagination";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ uid: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { uid } = await params;

  const [returnedCompany] = await db
    .select()
    .from(company)
    .where(eq(company.id, uid));

  return {
    title: `Due Diligence Questions for ${returnedCompany?.name}`,
    description: `Due Diligence Questions for ${returnedCompany?.name} with the ${returnedCompany?.description} ${returnedCompany?.website}`,
  };
}

const CompanyQuestionsPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ uid: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { uid } = await params;
  const { query, page } = await searchParams;

  const currentPage = Number(page) || 1;
  const limit = 50;
  const offset = (currentPage - 1) * limit;

  const { questions, totalPages, totalQuestions } =
    await getFilteredCompanyQuestionsByCompanyId(
      uid,
      query as string,
      offset,
      limit
    );

  return (
    <div className="container min-h-screen group mx-auto p-4 sm:p-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">
            Due Diligence Questions
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {totalQuestions} total questions
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {totalPages} total pages
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {currentPage} current page
          </p>
        </div>
        <SearchQuestionFilter />
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <Button
            size="sm"
            variant="outline"
            className="h-9 justify-center"
            asChild
          >
            <Link href={`/admin/companies/${uid}/questions/bulk-upload`}>
              <Upload className="size-4 mr-2" />
              Bulk Upload
            </Link>
          </Button>
          <Button size="sm" className="h-9 justify-center" asChild>
            <Link href={`/admin/companies/${uid}/questions/new`}>
              <Plus className="size-4 mr-2" />
              New Question
            </Link>
          </Button>
        </div>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="px-4 sm:px-6 py-3 border-b border-border/50">
          <CardTitle className="text-sm font-medium">Questions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-0 group-has-[[data-pending]]:animate-pulse">
            {questions.map((question) => (
              <QuestionItem
                key={question.id}
                question={question}
                companyId={uid}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <QuestionsPagination totalPages={totalPages} />
    </div>
  );
};

export default CompanyQuestionsPage;
