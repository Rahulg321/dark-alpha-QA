import React from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Trash2,
  Upload,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getCompanyQuestionsByCompanyId } from "@/lib/db/queries";
import QuestionItem from "./question-item";

const CompanyQuestionsPage = async ({
  params,
}: {
  params: Promise<{ uid: string }>;
}) => {
  const { uid } = await params;

  const questions = await getCompanyQuestionsByCompanyId(uid);

  const totalQuestions = questions.length;

  return (
    <div className="container mx-auto py-4 px-4 sm:py-6 sm:px-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">
            Due Diligence Questions
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {totalQuestions} total questions
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <Button
            size="sm"
            variant="outline"
            className="h-9 justify-center"
            asChild
          >
            <Link href={`/admin/companies/${uid}/questions/bulk-upload`}>
              <Upload className="h-4 w-4 mr-2" />
              Bulk Upload
            </Link>
          </Button>
          <Button size="sm" className="h-9 justify-center" asChild>
            <Link href={`/admin/companies/${uid}/questions/new`}>
              <Plus className="h-4 w-4 mr-2" />
              New Question
            </Link>
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search questions..." className="pl-10 h-10" />
        </div>
      </div>

      {/* Questions List */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="px-4 sm:px-6 py-3 border-b border-border/50">
          <CardTitle className="text-sm font-medium">Questions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-0">
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
      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CompanyQuestionsPage;
