"use client";

import React, { useState, useTransition } from "react";
import { Resource, ResourceCategory } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { editResource } from "@/lib/actions/edit-resource";

const ResourceEditForm = ({
  companyId,
  resource,
  resourceCategories,
}: {
  companyId: string;
  resource: Resource;
  resourceCategories: ResourceCategory[];
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    name: resource.name ?? "",
    description: resource.description ?? "",
    categoryId: resource.categoryId ?? "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const response = await editResource(
          resource.id,
          formData.name,
          formData.description,
          formData.categoryId,
          companyId
        );
        if (response.success) {
          toast.success("Resource updated successfully");
          router.push(`/admin/companies/${companyId}/resources/${resource.id}`);
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error("An error occured trying to update resource");
        console.error(error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.categoryId}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, categoryId: value }))
            }
          >
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            required
          />
        </div>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Updating...
          </>
        ) : (
          "Update Resource"
        )}
      </Button>
    </form>
  );
};

export default ResourceEditForm;
