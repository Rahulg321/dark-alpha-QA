"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import useSWR from "swr";
import { swrFetcher } from "@/lib/utils";
import { SetStateAction, Dispatch, useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";
import { Checkbox } from "../ui/checkbox";

export default function ResourceSelectDialog({
  selectedResources,
  setSelectedResources,
}: {
  selectedResources: { id: string; name: string; createdAt: Date }[];
  setSelectedResources: Dispatch<
    SetStateAction<{ id: string; name: string; createdAt: Date }[]>
  >;
}) {
  const {
    data: fetchedCompanies,
    error: companiesError,
    isLoading: companiesIsLoading,
  } = useSWR(`/api/companies`, swrFetcher);
  const [open, setOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  const {
    data: fetchedResources,
    error: resourcesError,
    isLoading: resourcesIsLoading,
  } = useSWR(
    selectedCompany ? `/api/companies/${selectedCompany}/resources` : null,
    swrFetcher
  );

  useEffect(() => {
    if (!open) {
      setSelectedCompany(null);
    }
  }, [open, setSelectedResources]);

  const handleResourceSelect = (resource: {
    id: string;
    name: string;
    createdAt: Date;
  }) => {
    setSelectedResources((prev) =>
      prev.includes(resource)
        ? prev.filter((r) => r.id !== resource.id)
        : [...prev, resource]
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          size={"sm"}
          className="rounded-full"
          aria-label="Select Resource"
        >
          Select Resources
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {selectedCompany ? "Select a Resource" : "Select a Company"}
          </DialogTitle>
          <DialogDescription>
            {selectedCompany
              ? "Select a document from the selected company."
              : "Select a company first then see its available documents."}
          </DialogDescription>
        </DialogHeader>

        {selectedCompany ? (
          <DisplayResourcesScreen
            resources={fetchedResources?.companyResources}
            isLoading={resourcesIsLoading}
            error={resourcesError}
            onBack={() => setSelectedCompany(null)}
            selectedResources={selectedResources}
            onResourceSelect={handleResourceSelect}
          />
        ) : (
          <DisplayCompaniesScreen
            companies={fetchedCompanies?.companies}
            isLoading={companiesIsLoading}
            error={companiesError}
            onSelectCompany={setSelectedCompany}
          />
        )}
        <DialogFooter>
          {selectedCompany && (
            <Button
              onClick={() => {
                // Here you can do something with the selected resources
                // For now, we'll just log them and close the dialog
                console.log("Selected resources:", selectedResources);
                setOpen(false);
              }}
              disabled={selectedResources.length === 0}
            >
              Select ({selectedResources.length})
            </Button>
          )}
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DisplayCompaniesScreen({
  companies,
  isLoading,
  error,
  onSelectCompany,
}: {
  companies: { id: string; name: string; resourceCount: number }[];
  isLoading: boolean;
  error: any;
  onSelectCompany: (companyId: string) => void;
}) {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (companies && companies.length === 0) {
    return <div>No companies found. Please contact support.</div>;
  }

  return (
    <div className="space-y-2">
      {companies &&
        companies.length > 0 &&
        companies.map((company) => (
          <div
            key={company.id}
            className="flex items-center justify-between gap-2 cursor-pointer p-2 hover:bg-accent rounded-md"
            onClick={() => onSelectCompany(company.id)}
          >
            <p className="text-sm font-medium">{company.name}</p>
            <p className="text-sm text-muted-foreground">
              {company.resourceCount} resources
            </p>
          </div>
        ))}
    </div>
  );
}

function DisplayResourcesScreen({
  resources,
  isLoading,
  error,
  onBack,
  selectedResources,
  onResourceSelect,
}: {
  resources: { id: string; name: string; createdAt: Date }[];
  isLoading: boolean;
  error: any;
  onBack: () => void;
  selectedResources: { id: string; name: string; createdAt: Date }[];
  onResourceSelect: (resource: {
    id: string;
    name: string;
    createdAt: Date;
  }) => void;
}) {
  return (
    <div>
      <Button variant="outline" size="sm" onClick={onBack} className="mb-4">
        Back to Companies
      </Button>
      {isLoading ? (
        <ResourceCardSkeleton />
      ) : error ? (
        <div>Error fetching resources.</div>
      ) : (
        <div className="space-y-2">
          <ScrollArea className="h-[300px]">
            {resources && resources.length > 0 ? (
              resources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  isSelected={selectedResources.includes(resource)}
                  onSelect={onResourceSelect}
                />
              ))
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-muted-foreground">
                  No resources found.
                </p>
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}

function ResourceCardSkeleton() {
  return (
    <div className="space-y-2 p-2 w-full">
      {[...Array(3)].map((_, i) => (
        <div
          className="flex items-center gap-4 p-2 hover:bg-accent rounded-md"
          key={i}
        >
          <Skeleton className="size-5 rounded" />
          <div className="grid gap-1.5 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ResourceCard({
  resource,
  isSelected,
  onSelect,
}: {
  resource: { id: string; name: string; createdAt: Date };
  isSelected: boolean;
  onSelect: (resource: { id: string; name: string; createdAt: Date }) => void;
}) {
  return (
    <div
      className="flex items-center gap-4 p-2 hover:bg-accent rounded-md cursor-pointer"
      onClick={() => onSelect(resource)}
    >
      <Checkbox checked={isSelected} id={resource.id} className="size-5" />
      <div className="grid gap-1.5">
        <p className="text-sm font-medium leading-none">{resource.name}</p>
        <p className="text-xs text-muted-foreground">
          Added on {new Date(resource.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
