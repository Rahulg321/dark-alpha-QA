"use client";

import { Answers } from "@/lib/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import ReactMarkdown from "react-markdown";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTransition } from "react";
import { DeleteAnswer } from "@/lib/actions/delete-answer";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const AnswerItem = ({
  answer,
  companyId,
  questionId,
}: {
  answer: Answers;
  companyId: string;
  questionId: string;
}) => {
  const [isPending, startTransition] = useTransition();

  return (
    <Card
      className={cn("overflow-hidden", {
        "animate-pulse": isPending,
      })}
    >
      <CardHeader className="bg-muted/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{answer.type}</Badge>
            {answer.createdAt && (
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(answer.createdAt))} ago
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link
                href={`/admin/companies/${answer.companyQuestionId}/questions/${answer.id}/edit`}
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit answer</span>
              </Link>
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => {
                startTransition(async () => {
                  const response = await DeleteAnswer(
                    companyId,
                    questionId,
                    answer.id
                  );
                  if (response.success) {
                    toast.success(response.message);
                  } else {
                    toast.error(response.message);
                  }
                });
              }}
              disabled={isPending}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete answer</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div
          className={cn("prose prose-sm max-w-none", {
            "animate-pulse": isPending,
          })}
        >
          <ReactMarkdown className={"text-justify"}>
            {answer.answer}
          </ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnswerItem;
