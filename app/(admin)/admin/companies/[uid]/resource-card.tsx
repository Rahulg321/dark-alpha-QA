"use client";

import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Resource } from "@/lib/db/schema";
import { FileText, MoreHorizontal } from "lucide-react";
import { File } from "buffer";
import { ImageIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { deleteResource } from "@/lib/actions/delete-resource";
import { toast } from "sonner";

const ResourceCard = ({
  resourceId,
  resourceName,
  resourceDescription,
  resourceKind,
  companyId,
}: {
  resourceId: string;
  resourceName: string;
  resourceDescription: string;
  resourceKind: string;
  companyId: string;
}) => {
  return (
    <Card
      key={resourceId}
      className="group hover:shadow-md transition-all duration-200"
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
            {resourceKind === "pdf" ? (
              <FileText className="h-4 w-4" />
            ) : resourceKind === "doc" ? (
              <FileText className="h-4 w-4" />
            ) : resourceKind === "docx" ? (
              <FileText className="h-4 w-4" />
            ) : resourceKind === "txt" ? (
              <FileText className="h-4 w-4" />
            ) : resourceKind === "jpg" ? (
              <ImageIcon className="h-4 w-4" />
            ) : resourceKind === "jpeg" ? (
              <ImageIcon className="h-4 w-4" />
            ) : resourceKind === "png" ? (
              <ImageIcon className="h-4 w-4" />
            ) : resourceKind === "gif" ? (
              <ImageIcon className="h-4 w-4" />
            ) : resourceKind === "webp" ? (
              <ImageIcon className="h-4 w-4" />
            ) : resourceKind === "xls" ? (
              <FileText className="h-4 w-4" />
            ) : resourceKind === "xlsx" ? (
              <FileText className="h-4 w-4" />
            ) : resourceKind === "image" ? (
              <ImageIcon className="h-4 w-4" />
            ) : resourceKind === "excel" ? (
              <FileText className="h-4 w-4" />
            ) : (
              <FileText className="h-4 w-4" />
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View</DropdownMenuItem>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => {
                  deleteResource(resourceId, companyId).then((res) => {
                    if (res.success) {
                      toast.success(res.message);
                    } else {
                      toast.error(res.message);
                    }
                  });
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <h3 className="font-semibold mb-2">{resourceName}</h3>
        {resourceDescription && (
          <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
            {resourceDescription}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ResourceCard;
