"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createCompanyQuestion } from "@/lib/actions/create-company-question";
import { toast } from "sonner";
import { createCompanyQuestionSchema } from "@/lib/schemas/create-company-question";
import { useRouter } from "next/navigation";

export default function NewQuestionForm({ companyId }: { companyId: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof createCompanyQuestionSchema>>({
    resolver: zodResolver(createCompanyQuestionSchema),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof createCompanyQuestionSchema>
  ) => {
    setIsSubmitting(true);
    try {
      const response = await createCompanyQuestion(companyId, values);

      if (response.success) {
        toast.success("Success🎉", {
          description: "Question created successfully",
          action: {
            label: "View Question",
            onClick: () => {
              router.push(
                `/admin/companies/${companyId}/questions/${response.questionId}`
              );
            },
          },
        });
        form.reset();
      } else {
        toast.error("Error❌", {
          description: response.message,
        });
      }
    } catch (error) {
      console.error("Failed to create question:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-4 px-4 sm:py-6 sm:px-6 max-w-3xl">
      {/* Navigation */}
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <Button variant="ghost" size="sm" asChild className="h-9">
          <Link href={`/admin/companies/${companyId}/questions`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Questions
          </Link>
        </Button>
      </div>

      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-semibold mb-2">
          Create New Question
        </h1>
        <p className="text-muted-foreground">
          Add a new due diligence question to your database
        </p>
      </div>

      {/* Form */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="px-4 sm:px-6 py-4 border-b border-border/50">
          <CardTitle className="text-base font-medium">
            Question Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter the due diligence question..."
                        className="min-h-[100px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 order-2 sm:order-1"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Create Question
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  asChild
                  className="order-1 sm:order-2"
                >
                  <Link href="/questions">Cancel</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
