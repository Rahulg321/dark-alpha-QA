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
import { useState } from "react";
import rehypeSanitize from "rehype-sanitize";
import { useTheme } from "next-themes";
import ReactMarkdown from "react-markdown";

export const newTicketFormSchema = z.object({
  title: z.string().min(2).max(50),
  description: z.string().min(10).max(100),
});

export type NewTicketFormSchemaType = z.infer<typeof newTicketFormSchema>;

const NewTicketForm = () => {
  const { theme } = useTheme();
  const [content, setContent] = useState("");
  const [error, setError] = useState<Record<string, string>>({});

  const handleContentChange = (value: string | undefined) => {
    if (value) {
      setContent(value);
    }
  };

  const form = useForm<z.infer<typeof newTicketFormSchema>>({
    resolver: zodResolver(newTicketFormSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof newTicketFormSchema>) {
    if (content.length < 10) {
      setError({ content: "Content must be at least 10 characters" });
      return;
    }
    console.log(values);
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div>
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

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default NewTicketForm;
