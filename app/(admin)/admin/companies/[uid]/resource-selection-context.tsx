"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface ResourceSelectionContextType {
  selectedResources: Set<string>;
  toggleResource: (resourceId: string) => void;
  selectAll: (resourceIds: string[]) => void;
  clearSelection: () => void;
  isSelected: (resourceId: string) => boolean;
  selectedCount: number;
}

const ResourceSelectionContext = createContext<ResourceSelectionContextType | undefined>(undefined);

export function ResourceSelectionProvider({ children }: { children: ReactNode }) {
  const [selectedResources, setSelectedResources] = useState<Set<string>>(new Set());

  const toggleResource = (resourceId: string) => {
    setSelectedResources(prev => {
      const newSet = new Set(prev);
      if (newSet.has(resourceId)) {
        newSet.delete(resourceId);
      } else {
        newSet.add(resourceId);
      }
      return newSet;
    });
  };

  const selectAll = (resourceIds: string[]) => {
    setSelectedResources(new Set(resourceIds));
  };

  const clearSelection = () => {
    setSelectedResources(new Set());
  };

  const isSelected = (resourceId: string) => {
    return selectedResources.has(resourceId);
  };

  const value: ResourceSelectionContextType = {
    selectedResources,
    toggleResource,
    selectAll,
    clearSelection,
    isSelected,
    selectedCount: selectedResources.size,
  };

  return (
    <ResourceSelectionContext.Provider value={value}>
      {children}
    </ResourceSelectionContext.Provider>
  );
}

export function useResourceSelection() {
  const context = useContext(ResourceSelectionContext);
  if (context === undefined) {
    throw new Error("useResourceSelection must be used within a ResourceSelectionProvider");
  }
  return context;
}