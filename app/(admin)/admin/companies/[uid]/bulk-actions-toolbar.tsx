"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Download, Move, Copy, X } from "lucide-react";
import { useResourceSelection } from "./resource-selection-context";
import { deleteResource } from "@/lib/actions/delete-resource";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface BulkActionsToolbarProps {
  companyId: string;
}

export function BulkActionsToolbar({ companyId }: BulkActionsToolbarProps) {
  const { selectedResources, selectedCount, clearSelection } = useResourceSelection();
  const router = useRouter();

  if (selectedCount === 0) {
    return null;
  }

  const handleBulkDelete = async () => {
    try {
      const deletePromises = Array.from(selectedResources).map(resourceId =>
        deleteResource(resourceId, companyId)
      );

      const results = await Promise.all(deletePromises);
      const successCount = results.filter(r => r.success).length;
      const errorCount = results.length - successCount;

      if (successCount > 0) {
        toast.success(`Successfully deleted ${successCount} resource${successCount > 1 ? 's' : ''}`);
      }
      if (errorCount > 0) {
        toast.error(`Failed to delete ${errorCount} resource${errorCount > 1 ? 's' : ''}`);
      }

      clearSelection();
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete resources");
      console.error("Bulk delete error:", error);
    }
  };

  const handleBulkDownload = () => {
    toast.info("Bulk download feature coming soon!");
  };

  const handleBulkMove = () => {
    toast.info("Bulk move feature coming soon!");
  };

  const handleBulkCopy = () => {
    toast.info("Bulk copy feature coming soon!");
  };

  return (
    <div className="sticky top-0 z-10 bg-background border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="flex items-center gap-2">
            {selectedCount} selected
          </Badge>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkDelete}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkDownload}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkMove}
            >
              <Move className="h-4 w-4 mr-2" />
              Move
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkCopy}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearSelection}
        >
          <X className="h-4 w-4 mr-2" />
          Clear
        </Button>
      </div>
    </div>
  );
}