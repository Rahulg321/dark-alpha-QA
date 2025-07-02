"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, FileText, } from "lucide-react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Textarea } from "../ui/textarea";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { ResourceCategory } from "@/lib/db/schema";

const newResourceFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  categoryId: z.string().min(1),
});

const NewResourceForm = ({
  companyId,
  resourceCategories,
}: {
  companyId: string;
  resourceCategories: ResourceCategory[];
}) => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof newResourceFormSchema>>({
    resolver: zodResolver(newResourceFormSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      const fileType = selectedFile.type;
      const fileName = selectedFile.name.toLowerCase();

      if (
        fileType === "application/msword" ||
        (fileName.endsWith(".doc") && !fileName.endsWith(".docx"))
      ) {
        setFile(null);
        setError(
          "We do not support .doc files. Please upload a .docx file instead."
        );
        return;
      }

      if (
        fileType === "application/pdf" ||
        fileType ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        fileType === "image/jpeg" ||
        fileType === "image/png" ||
        fileType === "image/gif" ||
        fileType === "image/webp" ||
        fileType === "application/vnd.ms-excel" ||
        fileType ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        setFile(selectedFile);
        setError(null);
      } else {
        setFile(null);
        setError("Please upload a PDF, DOCX, Excel Sheet or image file");
      }
    }
  };

  const onSubmit = async (values: z.infer<typeof newResourceFormSchema>) => {
    console.log(values);

    if (!file) {
      setError("Please select a file");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("companyId", companyId);
      formData.append("categoryId", values.categoryId);

      const response = await axios.post("/api/add-resource", formData);
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
      setFile(null);
      setError(null);
    } catch (err) {
      toast.error("Failed to create resource. Please try again.");
      setError("Failed to create resource. Please try again.");
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

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select {...field}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {resourceCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="file">Upload Document</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleFileChange}
                  className="flex-1"
                />
              </div>
              {error && (
                <span className="text-red-500 font-semibold text-sm mt-1">
                  {error}
                </span>
              )}
              {file && !error && (
                <p className="text-sm text-green-600 mt-1">
                  <FileText className="inline mr-1 h-4 w-4" />
                  {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </p>
              )}
            </div>
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

export default NewResourceForm;
