"use client";

import { Button } from "@/components/ui/button";

import { CompanyQuestions } from "@/lib/db/schema";
import { Loader2, Trash2 } from "lucide-react";
import Link from "next/link";

import React, { useTransition } from "react";
import { deleteQuestion } from "@/lib/actions/delete-question";
import { toast } from "sonner";

const QuestionItem = ({
  question,
  companyId,
}: {
  question: CompanyQuestions;
  companyId: string;
}) => {
  const [isPending, startTransition] = useTransition();
  return (
    <div
      className={`flex items-center justify-between px-4 sm:px-6 py-3 hover:bg-muted/30 group transition-colors `}
    >
      <div className="flex-1 min-w-0 pr-3">
        <Link
          href={`/admin/companies/${companyId}/questions/${question.id}`}
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
        onClick={() => {
          startTransition(async () => {
            const response = await deleteQuestion(question.id, companyId);
            if (response.success) {
              toast.success("Question deleted successfully");
            } else {
              toast.error("Failed to delete question");
            }
          });
        }}
      >
        {isPending ? (
          <Loader2 className="h-3.5 w-3.5 text-muted-foreground animate-spin" />
        ) : (
          <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </Button>
    </div>
  );
};

export default QuestionItem;
