"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { toast } from "sonner";
import { addCompany } from "@/lib/actions/add-company";
import { useRouter } from "next/navigation";
import { newCompanySchema } from "@/lib/schemas/new-company-schema";
import { companyTypes, companyIndustries } from "@/lib/db/types";

const NewCompanyForm = () => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof newCompanySchema>>({
    resolver: zodResolver(newCompanySchema),
    defaultValues: {
      name: "",
      type: "enterprise",
      website: "",
      email: "",
      address: "",
      description: "",
      industry: "other",
    },
  });

  async function onSubmit(values: z.infer<typeof newCompanySchema>) {
    startTransition(async () => {
      const result = await addCompany(values);
      if (result.success) {
        toast.success(result.message, {
          description: `Company ${values.name} created successfully`,
          action: {
            label: "View Company",
            onClick: () => {
              router.push(`/admin/companies/${result.company?.id}`);
            },
          },
        });
        form.reset();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="">
      <div className="container mx-auto py-8 px-4 md:px-6 max-w-2xl">
        <Link
          href={`/admin/companies`}
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Companies
        </Link>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Add Company</CardTitle>
            <p className="text-sm text-muted-foreground">
              Add a new company to the database
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Company Name" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                          <SelectContent>
                            {companyTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type
                                  .replace(/_/g, " ")
                                  .replace(/\b\w/g, (l) => l.toUpperCase())}
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
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select an industry" />
                          </SelectTrigger>
                          <SelectContent>
                            {companyIndustries.map((industry) => (
                              <SelectItem key={industry} value={industry}>
                                {industry
                                  .replace(/_/g, " ")
                                  .replace(/\b\w/g, (l) => l.toUpperCase())}
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
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123 Main St, Anytown, USA"
                          {...field}
                        />
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
                        <Textarea
                          placeholder="Company description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Adding..." : "Submit"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewCompanyForm;
