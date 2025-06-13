"use client";

import { useState, useTransition } from "react";
import { ArrowLeft, Plus, X, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { ResourceSelectionModal } from "./resource-selection-modal";
import { Session } from "next-auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

export default function CompareSection({
  resources,
  session,
}: {
  resources: {
    id: string;
    name: string;
    description: string | null;
  }[];
  session: Session;
}) {
  const [selectedResources, setSelectedResources] = useState<
    {
      id: string;
      name: string;
      description: string | null;
    }[]
  >([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [customQuery, setCustomQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [compareSelectionResult, setCompareSelectionResult] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleAddResource = (resource: {
    id: string;
    name: string;
    description: string | null;
  }) => {
    if (!selectedResources.find((r) => r.id === resource.id)) {
      setSelectedResources((prev) => [...prev, resource]);
    }
  };

  const handleRemoveResource = (resourceId: string) => {
    setSelectedResources((prev) => prev.filter((r) => r.id !== resourceId));
  };

  const handleGenerate = async () => {
    startTransition(async () => {
      try {
        setErrors({});
        setCompareSelectionResult("");

        if (!session?.accessToken) {
          throw new Error("No token available yet, please login again");
        }

        if (selectedResources.length < 2) {
          throw new Error("Please select at least 2 resources to compare");
        }

        if (customQuery.length < 10) {
          setErrors({
            customQuery:
              "Please enter a custom query to compare the resources (min 10 characters)",
          });
          throw new Error(
            "Please enter a custom query to compare the resources"
          );
        }

        const finalPrompt = `
        You are a helpful assistant that compares two or more resources.
        The resources are:
        ${selectedResources
          .map(
            (resource) =>
              `${resource.name} (ID: ${resource.id}) - ${
                resource.description || "No description"
              }`
          )
          .join(", ")}
        The custom query is: ${customQuery}
        `;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/compare`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.accessToken}`,
            },
            body: JSON.stringify({
              prompt: finalPrompt,
            }),
          }
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            errorData.error || "Failed to make the initial request."
          );
        }

        if (!res.body) {
          throw new Error("No response body");
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let done = false;

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          if (value) {
            console.log("value", value);
            setCompareSelectionResult((prev) => prev + decoder.decode(value));
          }
        }

        toast.success("Successfully made the initial request.");
      } catch (error) {
        console.error("Request failed:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to make the initial request."
        );
      }
    });
  };

  const availableResources = resources.filter(
    (resource) =>
      !selectedResources.find((selected) => selected.id === resource.id)
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4">
      {/* Header */}
      <div className="mb-2 flex flex-col items-center">
        <Link
          href="/companies"
          className="self-start inline-flex items-center text-muted-foreground hover:text-gray-700 text-xs mb-2"
        >
          <ArrowLeft className="size-3 mr-1" />
          Back
        </Link>
        <div className="text-center">
          <h1 className="text-lg font-semibold mb-1">Compare Resources</h1>
          <span className="text-muted-foreground text-xs">
            Compare resources based on your query
          </span>
        </div>
      </div>

      {/* Split Layout */}
      <div className="flex flex-col mt-4 md:mt-8 lg:mt-12 gap-2 sm:flex-row sm:gap-4">
        {/* Left: Selection & Query */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Selected Resources */}
          <Card className="border ">
            <CardContent className="p-2">
              {selectedResources.length === 0 ? (
                <div className="text-center py-4">
                  <h4 className="font-medium text-sm mb-1">
                    No resources selected
                  </h4>
                  <p className="text-muted-foreground text-xs mb-2">
                    Start by adding resources to compare
                  </p>
                  <Button
                    onClick={() => setIsModalOpen(true)}
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Resource
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">Selected Resources</h4>
                    <Button
                      onClick={() => setIsModalOpen(true)}
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add
                    </Button>
                  </div>

                  <div className="grid gap-2">
                    {selectedResources.map((resource) => (
                      <div
                        key={resource.id}
                        className="flex items-center gap-2 p-2 bg-muted/50 rounded border"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-xs truncate">
                            {resource.name}
                          </h4>
                          <span className="text-muted-foreground text-[10px] truncate">
                            {resource.description || "No description"}
                          </span>
                        </div>
                        <Button
                          onClick={() => handleRemoveResource(resource.id)}
                          variant="ghost"
                          size="sm"
                          className="p-0 text-gray-400 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-700 rounded-full"
                        >
                          <X className="size-3 dark:text-gray-400" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Custom Query */}
          {selectedResources.length > 0 && (
            <Card className="border ">
              <CardContent className="p-4 md:p-6">
                <h3 className="font-medium text-sm mb-1">Your Query</h3>
                <Textarea
                  placeholder="Enter specific questions or analysis points..."
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  rows={2}
                  className={cn(
                    "resize-none text-xs mb-1  my-4 px-4  py-4",
                    errors.customQuery && "border-red-500"
                  )}
                />
                {errors.customQuery && (
                  <p className="text-red-500 text-xs mt-0.5">
                    {errors.customQuery}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Generate Button */}
          {selectedResources.length > 0 && (
            <div className="text-center py-1">
              <Button
                onClick={handleGenerate}
                disabled={isPending}
                className="h-8 px-3 text-xs w-full"
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-3 animate-spin mr-1" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="size-3 mr-1" />
                    Generate Comparison
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Right: Result */}
        <div className="flex-1 min-w-0 space-y-2">
          <h3 className="text-xs font-semibold mb-1">
            Compare Selection Result
          </h3>
          <Card className="border h-[calc(100vh-200px)]">
            <ScrollArea className="h-full">
              <CardContent className="p-4">
                {isPending ? (
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[300px]" />
                    <Skeleton className="h-4 w-[275px]" />
                    <Skeleton className="h-4 w-[225px]" />
                  </div>
                ) : (
                  <ReactMarkdown className="prose dark:prose-invert text-xs prose-sm max-w-none">
                    {compareSelectionResult}
                  </ReactMarkdown>
                )}
              </CardContent>
            </ScrollArea>
          </Card>
        </div>
      </div>

      <ResourceSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        resources={availableResources}
        onSelectResource={handleAddResource}
      />
    </div>
  );
}
