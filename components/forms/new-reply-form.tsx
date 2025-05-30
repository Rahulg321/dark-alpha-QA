"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import MDEditor from "@uiw/react-md-editor";
import { useState, useTransition } from "react";
import rehypeSanitize from "rehype-sanitize";
import { useTheme } from "next-themes";
import { Ticket } from "@/lib/db/schema";
import ReactMarkdown from "react-markdown";
import { createReplyServerAction } from "@/app/(tickets)/actions";
import { TagInput } from "../tag-input";
import { Label } from "../ui/label";

export const newReplyFormSchema = z.object({
});

export type NewReplyFormSchemaType = z.infer<typeof newReplyFormSchema>;


type CreateReplyFormProps = {
  ticket: Ticket;
}

const NewReplyForm = ({ticket}: CreateReplyFormProps) => {
  const [isPending, startTransition] = useTransition();
  const { theme } = useTheme();
  const [content, setContent] = useState("");
  const [error, setError] = useState<Record<string, string>>({});
  const ticketId = ticket.id;

  const handleContentChange = (value: string | undefined) => {
    if (value) {
      setContent(value);
    }
  };

  const form = useForm<z.infer<typeof newReplyFormSchema>>({
    resolver: zodResolver(newReplyFormSchema),
                                                            defaultValues: {
                                                            },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof newReplyFormSchema>) {
    if (content.length < 10) {
      setError({ content: "Content must be at least 10 characters" });
      return;
    } else {
      startTransition(async() => {
        try {
          console.log("HERE")
          const response = await createReplyServerAction(ticketId,content);

          if ("error" in response) {
            console.log(response.error);
            return;
          } else {
            console.log(response.message || "Reply created");
            onSuccess?.();
          }
        } catch (error) {
          console.log(error);
        }
      });
    }
    console.log(values);
  }

  return (
    <div>
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
    <div>
    <Label>Content</Label>
    <MDEditor
    value={content}
    onChange={handleContentChange}
    style={{
      backgroundColor: theme === "dark" ? "#1a1a1a" : "#ffffff",
      color: theme === "dark" ? "#ffffff" : "#000000",
    }}
    previewOptions={{
      rehypePlugins: [[rehypeSanitize]],
      style: {
        backgroundColor: theme === "dark" ? "#1a1a1a" : "#ffffff",
        color: theme === "dark" ? "#ffffff" : "#000000",
      },
    }}
    />

    {error.content && (
      <span className="text-red-500 text-sm">{error.content}</span>
    )}
    </div>

    <Button type="submit" disabled={isPending}>Submit</Button>
    </form>
    </Form>
    </div>
  );
};

export default NewReplyForm;
