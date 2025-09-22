"use client";

import React from "react";

import { FileText, MoreHorizontal, Eye, Edit, Trash2, Download, Copy, Move } from "lucide-react";
import { BsFiletypePdf, BsFileImage, BsFiletypeExe } from "react-icons/bs";
import { PiFileAudioBold } from "react-icons/pi";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { deleteResource } from "@/lib/actions/delete-resource";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { useResourceSelection } from "./resource-selection-context";

// Helper to get the correct file icon
const getFileIcon = (kind: string) => {
  switch (kind) {
    case "pdf":
      return (
        <BsFiletypePdf className="size-5 sm:size-4" aria-label="PDF file" />
      );
    case "doc":
    case "docx":
    case "txt":
      return (
        <FileText className="size-5 sm:size-4" aria-label="Document file" />
      );
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "webp":
    case "image":
      return (
        <BsFileImage className="size-5 sm:size-4" aria-label="Image file" />
      );
    case "xls":
    case "xlsx":
    case "excel":
      return (
        <BsFiletypeExe className="size-5 sm:size-4" aria-label="Excel file" />
      );
    case "mp3":
    case "audio":
      return (
        <PiFileAudioBold className="size-5 sm:size-4" aria-label="Audio file" />
      );
    default:
      return <FileText className="size-5 sm:size-4" aria-label="File" />;
  }
};

const ResourceCard = ({
  resourceId,
  resourceName,
  resourceDescription,
  resourceKind,
  companyId,
  categoryName,
}: {
  resourceId: string;
  resourceName: string;
  resourceDescription: string;
  resourceKind: string;
  companyId: string;
  categoryName: string | null;
}) => {
  const router = useRouter();
  const { isSelected, toggleResource } = useResourceSelection();
  const selected = isSelected(resourceId);

  return (
    <div
      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-3 sm:px-6 py-3 hover:bg-muted/30 group transition-colors w-full ${
        selected ? "bg-muted/50" : ""
      }`}
      tabIndex={0}
      aria-label={`Resource card for ${resourceName}`}
    >
      <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1 pr-0 sm:pr-3 w-full">
        <Checkbox
          checked={selected}
          onCheckedChange={() => toggleResource(resourceId)}
          aria-label={`Select ${resourceName}`}
          className="mt-1 sm:mt-0"
        />
        <span className="size-10 sm:size-8 rounded bg-muted flex items-center justify-center text-muted-foreground shrink-0">
          {getFileIcon(resourceKind)}
        </span>
        <div className="min-w-0 flex-1">
          <Link
            href={`/admin/companies/${companyId}/resources/${resourceId}`}
            className="block focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
            tabIndex={0}
            aria-label={`View details for ${resourceName}`}
          >
            <p className="text-base sm:text-sm font-medium text-foreground truncate">
              {resourceName}
            </p>
            {resourceDescription && (
              <span className="block text-xs text-muted-foreground truncate max-w-full">
                {resourceDescription}
              </span>
            )}
            {categoryName && (
              <Badge className="mt-1 inline-block max-w-full truncate text-xs px-2 py-0.5">
                {categoryName}
              </Badge>
            )}
          </Link>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 sm:size-7 opacity-100 sm:opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity shrink-0"
            aria-label="Open resource menu"
          >
            <MoreHorizontal className="size-5 sm:size-4 text-muted-foreground" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={() => {
              router.push(
                `/admin/companies/${companyId}/resources/${resourceId}`
              );
            }}
            aria-label="View resource"
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              router.push(
                `/admin/companies/${companyId}/resources/${resourceId}/edit`
              );
            }}
            aria-label="Edit resource"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              toast.info("Download feature coming soon!");
            }}
            aria-label="Download resource"
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(resourceName);
              toast.success("Resource name copied to clipboard");
            }}
            aria-label="Copy resource name"
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy Name
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              toast.info("Move feature coming soon!");
            }}
            aria-label="Move resource"
          >
            <Move className="mr-2 h-4 w-4" />
            Move
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => {
              if (confirm(`Are you sure you want to delete "${resourceName}"?`)) {
                deleteResource(resourceId, companyId).then((res) => {
                  if (res.success) {
                    toast.success(res.message);
                  } else {
                    toast.error(res.message);
                  }
                });
              }
            }}
            aria-label="Delete resource"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ResourceCard;
