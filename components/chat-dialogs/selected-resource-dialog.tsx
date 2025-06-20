"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "../ui/dialog";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { ChevronDownIcon, XIcon, FileTextIcon } from "lucide-react";
import { useWindowSize } from "usehooks-ts";

const SelectedResourceDialog = ({
  selectedResources,
  setSelectedResources,
}: {
  selectedResources: { id: string; name: string; createdAt: Date }[];
  setSelectedResources: Dispatch<
    SetStateAction<{ id: string; name: string; createdAt: Date }[]>
  >;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="p-0 h-auto">
          <span className="text-xs font-medium">
            {selectedResources.length} resources selected
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Selected Resources
          </DialogTitle>
          <DialogDescription>
            Manage your selected resources for this conversation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {selectedResources.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FileTextIcon className="size-12 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">
                No resources selected
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Select resources from the resource picker to see them here
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-3">
                {selectedResources.map((resource) => (
                  <div
                    key={resource.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 mt-0.5">
                        <FileTextIcon className="size-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-tight truncate">
                          {resource.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Added on{" "}
                          {new Date(resource.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-shrink-0 h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                      onClick={() =>
                        setSelectedResources(
                          selectedResources.filter((r) => r.id !== resource.id)
                        )
                      }
                    >
                      <XIcon className="size-4" />
                      <span className="sr-only">Remove {resource.name}</span>
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        <DialogFooter className="flex flex-row gap-2 pt-4">
          {selectedResources.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setSelectedResources([])}
              className="flex-1"
            >
              Deselect All
            </Button>
          )}
          <DialogClose asChild>
            <Button variant="default" className="flex-1">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SelectedResourceDialog;
