"use client";

import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resourceCategorySchema } from "@/lib/schemas/resource-category-schema";
import type { ResourceCategorySchema } from "@/lib/schemas/resource-category-schema";
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
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addResourceCategory } from "@/lib/actions/add-resource-category";

const ResourceCategoryForm = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<ResourceCategorySchema>({
    resolver: zodResolver(resourceCategorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: ResourceCategorySchema) => {
    startTransition(async () => {
      try {
        const response = await addResourceCategory(data);

        if (!response.success) {
          throw new Error("Failed to create resource category");
        }

        toast.success(response.message);
        router.push("/admin/categories");
        router.refresh();
      } catch (error) {
        toast.error("Failed to create resource category", {
          description: error instanceof Error ? error.message : "Unknown error",
        });
        console.error(error);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter category name" {...field} />
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
                <Textarea placeholder="Enter category description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create Category"}
        </Button>
      </form>
    </Form>
  );
};

export default ResourceCategoryForm;
