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

const CompanyQuestionsPage = async ({
  params,
}: {
  params: Promise<{ uid: string }>;
}) => {
  const { uid } = await params;

  const questions = [
    {
      id: "q1",
      title:
        "What are the company's total assets and liabilities for the last three fiscal years?",
    },
    {
      id: "q2",
      title:
        "Provide documentation of all regulatory compliance certifications currently held.",
    },
    {
      id: "q3",
      title:
        "List all intellectual property rights, patents, and trademarks owned by the company.",
    },
    {
      id: "q4",
      title:
        "What is the current employee headcount and organizational structure?",
    },
    {
      id: "q5",
      title:
        "Provide tax compliance history and any outstanding tax liabilities.",
    },
    {
      id: "q6",
      title:
        "What are the key business risks and mitigation strategies currently in place?",
    },
    {
      id: "q7",
      title:
        "Provide details of all material contracts and agreements with third parties.",
    },
    {
      id: "q8",
      title:
        "What is the company's revenue breakdown by product line for the past five years?",
    },
    {
      id: "q9",
      title:
        "Describe the company's environmental compliance and sustainability initiatives.",
    },
    {
      id: "q10",
      title:
        "What are the details of the company's insurance coverage and claims history?",
    },
    {
      id: "q11",
      title:
        "Provide information about key management personnel and their backgrounds.",
    },
    {
      id: "q12",
      title:
        "What are the company's major customer relationships and concentration risks?",
    },
  ];

  const currentPage = 1;
  const totalPages = 5;
  const totalQuestions = 47;

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
            {questions.map((question, index) => (
              <div
                key={question.id}
                className={`flex items-center justify-between px-4 sm:px-6 py-3 hover:bg-muted/30 group transition-colors ${
                  index !== questions.length - 1
                    ? "border-b border-border/30"
                    : ""
                }`}
              >
                <div className="flex-1 min-w-0 pr-3">
                  <Link
                    href={`/admin/companies/${uid}/questions/${question.id}`}
                    className="block"
                  >
                    <p className="text-sm font-medium text-foreground hover:text-primary transition-colors line-clamp-2 leading-relaxed">
                      {question.title}
                    </p>
                  </Link>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                >
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
        <div className="text-sm text-muted-foreground order-2 sm:order-1">
          Showing {(currentPage - 1) * 10 + 1}-
          {Math.min(currentPage * 10, totalQuestions)} of {totalQuestions}{" "}
          questions
        </div>
        <div className="flex items-center gap-2 order-1 sm:order-2">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                className="h-8 w-8 p-0"
              >
                {page}
              </Button>
            ))}
          </div>

          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompanyQuestionsPage;
