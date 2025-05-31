"use client";

import { Button } from "@/components/ui/button";
import React, { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { deleteCompany } from "@/lib/actions/delete-company";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const DeleteCompanyButton = ({ companyId }: { companyId: string }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = async () => {
    startTransition(async () => {
      const result = await deleteCompany(companyId);
      if (result.success) {
        toast.success("Company deleted successfully");
        router.push("/admin/companies");
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <Button variant="destructive" disabled={isPending} onClick={handleDelete}>
      {isPending ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Deleting...
        </div>
      ) : (
        "Delete Company"
      )}
    </Button>
  );
};

export default DeleteCompanyButton;
