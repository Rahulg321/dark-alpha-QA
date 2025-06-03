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
import { Label } from "@/components/ui/label";
import { Loader2, FileText, Upload } from "lucide-react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Textarea } from "../ui/textarea";
import { useRouter } from "next/navigation";
import { createFolder } from "@/lib/actions/create-folder";
import { moveDocument } from "@/lib/actions/move-document";

const newFolderFormSchema = z.object({
  name: z.string().min(1)
});

const NewFolderForm = ({ companyId, resourceId }: { companyId: string, resourceId: string }) => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof newFolderFormSchema>>({
    resolver: zodResolver(newFolderFormSchema),
                                                              defaultValues: {
                                                                name: "",
                                                              },
  });

  const onSubmit = async (values: z.infer<typeof newFolderFormSchema>) => {
    console.log(values);

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("name", values.name);
      let reply = await createFolder(companyId, values.name);
      console.log("Reply", reply)
      moveDocument(resourceId, reply.folderId, companyId);

      toast.success("Successful!!", {
        description: `${values.name} created successfully`,
        action: {
          label: "Return",
          onClick: () => {
            router.push(`/admin/companies/${companyId}`);
          },
        },
      });
      form.reset();
      setFile(null);
      setError(null);
    } catch (err) {
      toast.error("Failed to create folder. Please try again.");
      setError("Failed to create folder. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
    <div className="grid w-full items-center gap-4">
    <FormField
    control={form.control}
    name="name"
    render={({ field }) => (
      <FormItem>
      <FormLabel>Name</FormLabel>
      <FormControl>
      <Input {...field} />
      </FormControl>
      <FormMessage />
      </FormItem>
    )}
    />
    </div>
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

export default NewFolderForm;
