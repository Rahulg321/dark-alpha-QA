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
import { ChevronDownIcon, XIcon } from "lucide-react";

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
        <Button variant="link" className="">
          <span className="text-xs ">
            {selectedResources.length} resources selected
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Selected Resources</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[300px]">
          {selectedResources.map((resource) => (
            <div key={resource.id} className="flex flex-row gap-2">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium leading-none">
                  {resource.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Added on {new Date(resource.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() =>
                  setSelectedResources(
                    selectedResources.filter((r) => r.id !== resource.id)
                  )
                }
              >
                <XIcon className="size-4" />
              </Button>
            </div>
          ))}
        </ScrollArea>
        <DialogFooter className="flex flex-row gap-2">
          <Button variant="outline" onClick={() => setSelectedResources([])}>
            Deselect All
          </Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SelectedResourceDialog;
