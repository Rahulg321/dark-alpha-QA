"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Resource } from "@/lib/db/schema";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ResourceSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  resources: Resource[];
  onSelectResource: (resource: Resource) => void;
}

export function ResourceSelectionModal({
  isOpen,
  onClose,
  resources,
  onSelectResource,
}: ResourceSelectionModalProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredResources = resources.filter(
    (resource) =>
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.categoryId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (resource: Resource) => {
    onSelectResource(resource);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-xl lg:max-w-2xl max-h-[80vh] flex flex-col p-2 sm:p-3 min-h-0">
        <DialogHeader className="pb-1 sm:pb-2">
          <DialogTitle className="">Add Resource</DialogTitle>
          <DialogDescription className="">
            Select a resource to add to the comparison
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[150px] sm:h-[200px] md:h-[300px] rounded-md">
          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            {filteredResources.length === 0 ? (
              <div className="text-center py-2 sm:py-3 md:py-4 text-muted-foreground">
                <p className="text-[10px] sm:text-xs">No resources found</p>
              </div>
            ) : (
              filteredResources.map((resource) => {
                return (
                  <div
                    key={resource.id}
                    onClick={() => handleSelect(resource)}
                    className="flex items-start gap-2 p-2 border rounded hover:bg-muted cursor-pointer transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium mb-0.5 truncate">
                        {resource.name}
                      </h4>
                      <span className="text-xs text-muted-foreground line-clamp-2">
                        {resource.description || "No description"}
                      </span>
                      <span className="inline-block text-xs text-muted-foreground px-1.5 py-0.5 rounded-sm mt-1">
                        {resource.categoryId || "No category"}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t mt-2">
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
