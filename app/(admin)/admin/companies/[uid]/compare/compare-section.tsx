"use client";

import { useState, useTransition } from "react";
import { ArrowLeft, Plus, X, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { ResourceSelectionModal } from "./resource-selection-modal";
import { Resource } from "@/lib/db/schema";

export default function CompareSection({
  resources,
}: {
  resources: Resource[];
}) {
  const [selectedResources, setSelectedResources] = useState<Resource[]>([]);
  const [customQuery, setCustomQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isPending, startTransition] = useTransition();

  const handleAddResource = (resource: Resource) => {
    if (!selectedResources.find((r) => r.id === resource.id)) {
      setSelectedResources((prev) => [...prev, resource]);
    }
  };

  const handleRemoveResource = (resourceId: string) => {
    setSelectedResources((prev) => prev.filter((r) => r.id !== resourceId));
  };

  const handleGenerate = async () => {
    if (selectedResources.length === 0) return;

    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    });
  };

  const availableResources = resources.filter(
    (resource) =>
      !selectedResources.find((selected) => selected.id === resource.id)
  );

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Header */}
      <div className="mb-6 flex flex-col items-center">
        <Link
          href="/companies"
          className="self-start inline-flex items-center text-muted-foreground hover:text-gray-700 text-xs mb-4"
        >
          <ArrowLeft className="w-3 h-3 mr-1" />
          Back
        </Link>
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">Compare Resources</h1>
          <span className="text-muted-foreground text-sm">
            Add resources to compare
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-4">
        {/* Selected Resources */}
        <Card className="border border-gray-200">
          <CardContent className="p-4">
            {selectedResources.length === 0 ? (
              <div className="text-center py-8">
                <h4 className="font-medium text-lg mb-2">
                  No resources selected
                </h4>
                <p className="text-muted-foreground mb-4">
                  Start by adding resources to compare
                </p>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  variant="outline"
                  size="sm"
                  className="h-9 px-4"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Resource
                </Button>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-lg">Selected Resources</h4>
                  <Button
                    onClick={() => setIsModalOpen(true)}
                    variant="ghost"
                    size="sm"
                    className="h-8 text-sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>

                <div className="grid gap-3">
                  {selectedResources.map((resource) => (
                    <div
                      key={resource.id}
                      className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-base truncate">
                          {resource.name}
                        </h4>
                        <p className="text-muted-foreground text-sm truncate">
                          {resource.categoryId || "No category"}
                        </p>
                      </div>
                      <Button
                        onClick={() => handleRemoveResource(resource.id)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-gray-700"
                      >
                        <X className="w-4 h-4" />
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
          <Card className="border border-gray-200">
            <CardContent className="p-4">
              <h3 className="font-medium text-lg mb-3">
                Custom Query (Optional)
              </h3>
              <Textarea
                placeholder="Enter specific questions or analysis points..."
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                rows={3}
                className="resize-none text-sm mb-2"
              />
              <p className="text-muted-foreground text-sm">
                Add specific questions to guide the analysis
              </p>
            </CardContent>
          </Card>
        )}

        {/* Generate Button */}
        {selectedResources.length > 0 && (
          <div className="text-center py-4">
            <Button
              onClick={handleGenerate}
              disabled={isPending}
              className="h-10 px-6"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  {isPending ? "Generating..." : "Generating"}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Comparison
                </>
              )}
            </Button>
          </div>
        )}
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
