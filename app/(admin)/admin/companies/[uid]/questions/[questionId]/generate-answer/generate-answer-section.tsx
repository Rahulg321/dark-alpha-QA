"use client";

import {
  useCompletion,
  experimental_useObject as useObject,
} from "@ai-sdk/react";

import React, { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { generateAnswerSchema } from "@/lib/schemas/generate-answer-schema";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { createAiAnswer } from "@/lib/actions/create-ai-answer";
import { useRouter } from "next/navigation";

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
    <div className="narrow-container ">
      <h2>Q:- {question}</h2>

      {error && <p className="text-red-500">{error.message}</p>}

      <div className="flex gap-2 mb-4">
        <Input
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          placeholder="Enter any custom instructions?"
        />
        <Button onClick={handleButtonClick} disabled={isLoading}>
          {isLoading ? "Generating..." : "Generate answer"}
        </Button>
      </div>

      {completion && (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown>{completion}</ReactMarkdown>
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
        </div>
      )}
    </div>
  );
};

export default GenerateAnswerSection;
