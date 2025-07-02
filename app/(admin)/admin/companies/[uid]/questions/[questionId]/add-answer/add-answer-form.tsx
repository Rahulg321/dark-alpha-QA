"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  type AddAnswerFormValues,
  addAnswerSchema,
} from "@/lib/schemas/add-answer-schema";
import { AddAnswerForCompanyQuestion } from "@/lib/actions/create-answer";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const AddAnswerForm = ({
  companyId,
  companyQuestionId,
}: {
  companyId: string;
  companyQuestionId: string;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<AddAnswerFormValues>({
    resolver: zodResolver(addAnswerSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (values: AddAnswerFormValues) => {
    startTransition(async () => {
      const response = await AddAnswerForCompanyQuestion(
        companyId,
        companyQuestionId,
        values
      );
      if (response.success) {
        toast.success(response.message, {
          description: "Answer added successfully",
          action: {
            label: "View Answer",
            onClick: () => {
              router.push(
                `/admin/companies/${companyId}/questions/${companyQuestionId}`
              );
            },
          },
        });
        form.reset();
      } else {
        toast.error(response.message);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Answer *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your answer..."
                  className="min-h-[100px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? "Submitting..." : "Add Answer"}
        </Button>
      </form>
    </Form>
  );
};

export default AddAnswerForm;
