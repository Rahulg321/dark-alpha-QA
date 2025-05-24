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
import ReactMarkdown from "react-markdown";
import { createTicketServerAction } from "@/app/(tickets)/actions";
import { TagInput } from "../tag-input";
import { Label } from "../ui/label";

export const newTicketFormSchema = z.object({
  title: z.string().min(2).max(50),
  description: z.string().min(10).max(100),
});

export type NewTicketFormSchemaType = z.infer<typeof newTicketFormSchema>;

const NewTicketForm = () => {
  const [isPending, startTransition] = useTransition();
  const { theme } = useTheme();
  const [content, setContent] = useState("");
  const [error, setError] = useState<Record<string, string>>({});
  const [tags, setTags] = useState<string[]>([]);

  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags);
    console.log("Tags updated:", newTags);
  };

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
      tags: [],
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof newTicketFormSchema>) {
    if (content.length < 10) {
      setError({ content: "Content must be at least 10 characters" });
      return;
    } else {
      startTransition(async() => {
        try {
          const response = await createTicketServerAction(values, content, tags);

          if ("error" in response) {
            console.log(response.error);
            return;
          } else {
            console.log(response.message || "Ticket created");
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
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <Label>Add Tags</Label>

            <TagInput
              tags={tags}
              setTags={handleTagsChange}
              placeholder="Add tags..."
              maxTags={10}
              onTagAdd={(tag) => console.log(`Added: ${tag}`)}
              onTagRemove={(tag) => console.log(`Removed: ${tag}`)}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Lorem ipsum, dolor sit amet" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

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

export default NewTicketForm;
