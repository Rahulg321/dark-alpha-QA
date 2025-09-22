"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useResourceSelection } from "./resource-selection-context";

interface SelectAllCheckboxProps {
  resourceIds: string[];
}

export function SelectAllCheckbox({ resourceIds }: SelectAllCheckboxProps) {
  const { selectedResources, selectAll, clearSelection, selectedCount } = useResourceSelection();

  const isAllSelected = resourceIds.length > 0 && resourceIds.every(id => selectedResources.has(id));
  const isIndeterminate = selectedCount > 0 && selectedCount < resourceIds.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      clearSelection();
    } else {
      selectAll(resourceIds);
    }
  };

  if (resourceIds.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 px-4 py-2 border-b border-border bg-muted/20">
      <Checkbox
        checked={isAllSelected ? true : isIndeterminate ? "indeterminate" : false}
        onCheckedChange={handleSelectAll}
        aria-label="Select all resources"
      />
      <label className="text-sm text-muted-foreground">
        {isAllSelected
          ? `All ${resourceIds.length} resources selected`
          : selectedCount > 0
            ? `${selectedCount} of ${resourceIds.length} resources selected`
            : `Select all ${resourceIds.length} resources`
        }
      </label>
    </div>
  );
}