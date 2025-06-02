import {
  getAllAnswersByQuestionId,
  getCompanyQuestionById,
} from "@/lib/db/queries";
import React from "react";
import AddAnswerDialog from "./add-answer-dialog";
import GenerateAnswerSection from "./generate-answer/generate-answer-section";
import QuestionItem from "../question-item";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import AnswerItem from "./answer-item";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Question Details",
  description: "Question details",
};

const QuestionPage = async ({
  params,
}: {
  params: Promise<{ uid: string; questionId: string }>;
}) => {
  const { uid, questionId } = await params;

  const question = await getCompanyQuestionById(questionId);
  const answers = await getAllAnswersByQuestionId(questionId);

  if (!question) {
    return <div>Question not found</div>;
  }

  return (
    <div className="block-space-mini big-container space-y-8">
      <div className="space-y-4">
        <Link
          href={`/admin/companies/${uid}/questions`}
          className="text-sm text-muted-foreground flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to questions list
        </Link>

        <h1 className="text-3xl font-bold tracking-tight">Question Details</h1>
        <Card>
          <CardHeader>
            <CardTitle>{question.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                {question.createdAt && (
                  <span className="text-sm text-muted-foreground">
                    Created {formatDistanceToNow(new Date(question.createdAt))}{" "}
                    ago
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Button asChild variant="default">
                  <Link
                    href={`/admin/companies/${uid}/questions/${questionId}/add-answer`}
                  >
                    Add Answer
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link
                    href={`/admin/companies/${uid}/questions/${questionId}/generate-answer`}
                  >
                    Generate Answer
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">
          Answers ({answers.length})
        </h2>
        {answers.length > 0 ? (
          <div className="grid gap-4">
            {answers.map((answer) => (
              <AnswerItem
                key={answer.id}
                answer={answer}
                companyId={uid}
                questionId={questionId}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <h3 className="text-lg font-semibold">No answers yet</h3>
              <p className="text-sm text-muted-foreground">
                Be the first to add an answer to this question
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QuestionPage;
