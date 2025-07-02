"use client";

import {
  useCompletion,
} from "@ai-sdk/react";

import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { createAiAnswer } from "@/lib/actions/create-ai-answer";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Markdown } from "@/components/markdown";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const GenerateAnswerSection = ({
  question,
  companyId,
  questionId,
}: {
  question: string;
  companyId: string;
  questionId: string;
}) => {
  const [instruction, setInstruction] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { completion, complete, isLoading, error } = useCompletion({
    api: "/api/screen-question",
  });

  const handleButtonClick = async () => {
    await complete(
      `For Company with id: ${companyId}, generate an answer for the question: ${instruction} ${
        instruction ? " " : ""
      } ${question}`
    );
  };

  return (
    <div className="space-y-6">
      <Card className="mb-2">
        <CardHeader>
          <CardTitle className="text-lg">Question</CardTitle>
          <CardDescription className="text-base text-foreground/80">
            {question}
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="space-y-2">
        <label
          htmlFor="instruction"
          className="block text-sm font-medium text-muted-foreground mb-1"
        >
          Custom Instructions (optional)
        </label>
        <Textarea
          id="instruction"
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          placeholder="Enter any custom instructions..."
          className="resize-none min-h-[60px]"
          disabled={isLoading}
        />
        <div className="flex justify-end">
          <Button
            onClick={handleButtonClick}
            disabled={isLoading || !question}
            className="mt-2 min-w-[140px]"
          >
            {isLoading ? <Skeleton className="h-5 w-24" /> : "Generate Answer"}
          </Button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error.message}</p>}
      </div>
      <Separator className="my-4" />
      {isLoading && !completion && (
        <Card className="mt-4">
          <CardContent className="p-6">
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      )}
      {completion && (
        <Card className="mt-4 border-primary/60 shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-primary">
              Generated Answer
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-muted/40 rounded-b-lg">
            <div className="prose prose-sm max-w-none">
              <Markdown>{completion}</Markdown>
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-end gap-2 p-4 border-t">
            <Button
              variant="default"
              disabled={isPending}
              onClick={() => {
                startTransition(async () => {
                  const { success, message, answerId, answerText } =
                    await createAiAnswer(companyId, questionId, completion);

                  if (success) {
                    toast.success("Success🎉", {
                      description: "Answer saved successfully",
                      action: {
                        label: "View Answer",
                        onClick: () => {
                          router.push(
                            `/admin/companies/${companyId}/questions/${questionId}`
                          );
                        },
                      },
                    });
                  } else {
                    toast.error(message);
                  }
                });
              }}
            >
              {isPending ? "Saving..." : "Save Answer"}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default GenerateAnswerSection;
