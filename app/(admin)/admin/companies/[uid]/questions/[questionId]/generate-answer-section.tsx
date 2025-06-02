"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const GenerateAnswerSection = ({
  questionText,
  companyId,
}: {
  questionText: string;
  companyId: string;
}) => {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    addToolResult,
  } = useChat({
    api: "/api/screen-question",
    body: {
      questionText,
      companyId,
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">AI Analysis</h2>
      </div>

      <ScrollArea className="h-[400px] rounded-lg border bg-card">
        <div className="p-4 space-y-4">
          <div className="flex flex-col gap-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col gap-2 max-w-[85%] ${
                  message.role === "user" ? "ml-auto" : "mr-auto"
                }`}
              >
                <div>{message.role === "user" ? "User: " : "AI: "}</div>
                <div>{message.role === "assistant" && message.content}</div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Generating response...</span>
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error.message || "Something went wrong. Please try again."}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      <div className="space-y-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            className="flex-1 rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={input}
            placeholder="Type your message..."
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <Button
            type="submit"
            className="min-w-[140px]"
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Generate Answer"
            )}
          </Button>
        </form>

        <Button variant="outline" type="button" data-close className="w-full">
          Close
        </Button>
      </div>
    </div>
  );
};

export default GenerateAnswerSection;

function DisplayAnswer({ answer }: { answer: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Answer</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="text-sm whitespace-pre-wrap">{answer}</pre>
      </CardContent>
    </Card>
  );
}
