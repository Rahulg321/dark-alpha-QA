"use client";

import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";
import { useTheme } from "next-themes";
import { TagInput } from "../tag-input";
import { Label } from "../ui/label";
import { createTicketServerAction } from "@/app/(tickets)/actions";
import { toast } from "sonner";
import { newTicketFormSchema } from "@/lib/schemas/new-ticket-form-schema";
import {
  Select,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../ui/select";
import { useRouter } from "next/navigation";
import { Textarea } from "../ui/textarea";
import { ticketPriorities } from "@/lib/db/types";

const NewTicketForm = () => {
  const { theme } = useTheme();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [error, setError] = useState<Record<string, string>>({});
  const [tags, setTags] = useState<string[]>([]);

  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags);
    console.log("Tags updated:", newTags);
  };

  const form = useForm<z.infer<typeof newTicketFormSchema>>({
    resolver: zodResolver(newTicketFormSchema),
    defaultValues: {
      title: "",
      description: "",
      fromName: "",
      fromEmail: "",
      priority: "low",
      tags: [],
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

      const formdata = new FormData();
      formdata.append("title", values.title);
      formdata.append("description", values.description);
      formdata.append("tags", JSON.stringify(tags));
      formdata.append("fromName", values.fromName);
      formdata.append("fromEmail", values.fromEmail);
      formdata.append("priority", values.priority);

      console.log(formdata);

      const response = await createTicketServerAction(formdata);

      if (!response.success) {
        setError({ content: response.message });
        toast.error(response.message);
      }

      toast.success(response.message, {
        action: {
          label: "View Ticket",
          onClick: () => {
            router.push(`/tickets/${response.ticketId}`);
          },
        },
      });
      form.reset();
      setTags([]);
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
          <FormField
            control={form.control}
            name="fromName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>From Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fromEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>From Email</FormLabel>
                <FormControl>
                  <Input placeholder="john.doe@example.com" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {ticketPriorities.map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
          <div>
            <Label>Description</Label>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your description here..."
                      rows={10}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
