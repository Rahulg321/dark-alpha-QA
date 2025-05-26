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
import { TagInput } from "../tag-input";
import { Label } from "../ui/label";
import MarkdownEditor from "../MDXEditors/MarkdownEditor";
import { createTicketServerAction } from "@/app/(tickets)/actions";
import { toast } from "sonner";

export const newTicketFormSchema = z.object({
  title: z.string().min(2).max(50),
  description: z.string().min(10).max(100),
});

export type NewTicketFormSchemaType = z.infer<typeof newTicketFormSchema>;

const NewTicketForm = () => {
  const { theme } = useTheme();
  const [isPending, startTransition] = useTransition();

  const [content, setContent] = useState("");
  const [error, setError] = useState<Record<string, string>>({});
  const [tags, setTags] = useState<string[]>([]);

  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags);
    console.log("Tags updated:", newTags);
  };

  const handleContentChange = (value: string | undefined) => {
    setContent(value ?? "");
  };

  const form = useForm<z.infer<typeof newTicketFormSchema>>({
    resolver: zodResolver(newTicketFormSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof newTicketFormSchema>) {
    startTransition(async () => {
      if (tags.length < 1) {
        setError({ tags: "At least one tag is required" });
        toast.error("At least one tag is required");
        return;
      }

      if (content.length < 10) {
        setError({ content: "Content must be at least 10 characters" });
        toast.error("Content must be at least 10 characters");
        return;
      }

      const formdata = new FormData();
      formdata.append("title", values.title);
      formdata.append("description", values.description);
      formdata.append("content", content);
      formdata.append("tags", tags.join(","));

      console.log(formdata);

      const response = await createTicketServerAction(formdata);

      if (response.error) {
        setError({ content: response.error });
        toast.error(response.error);
      } else {
        toast.success("Ticket created successfully");
        form.reset();
        setContent("");
        setTags([]);
      }
    });
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
            {error.tags && (
              <span className="text-red-500 text-sm">{error.tags}</span>
            )}
          </div>

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
            <Label>Content</Label>
            <MarkdownEditor value={content} onChange={handleContentChange} />

            {error.content && (
              <span className="text-red-500 text-sm">{error.content}</span>
            )}
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default NewTicketForm;
