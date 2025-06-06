"use client";

import type React from "react";
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
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Loader2, FileText } from "lucide-react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { newAudioFormSchema } from "@/lib/schemas/add-audio-resource";

const NewAudioForm = ({ companyId }: { companyId: string }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof newAudioFormSchema>>({
    resolver: zodResolver(newAudioFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof newAudioFormSchema>) => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", values.file);
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("companyId", companyId);

      const response = await axios.post("/api/add-audio-resource", formData);
      if (response.status !== 200) {
        throw new Error("Failed to process file");
      }

      toast.success("Successful!!", {
        description: `${values.name} created successfully`,
        action: {
          label: "View",
          onClick: () => {
            router.push(`/admin/companies/${companyId}`);
          },
        },
      });
      form.reset();
    } catch (err) {
      toast.error("Failed to create resource. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormDescription>
                  This is the name of the audio resource.
                </FormDescription>
                <FormControl>
                  <Input {...field} />
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
                <FormDescription>
                  This is the description of the audio resource.
                </FormDescription>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="file"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Upload Audio</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="audio/*,.mp3,.wav,.ogg,.m4a"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onChange(file);
                      }
                    }}
                    {...field}
                  />
                </FormControl>
                {value && (
                  <p className="text-sm text-green-600 mt-1">
                    <FileText className="inline mr-1 h-4 w-4" />
                    {value.name} ({(value.size / 1024).toFixed(2)} KB)
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="shrink-0">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing
              </>
            ) : (
              <>Submit</>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default NewAudioForm;
