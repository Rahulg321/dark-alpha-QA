"use client";

import React from "react";

import { FileText, MoreHorizontal } from "lucide-react";
import { BsFiletypePdf, BsFileImage, BsFiletypeExe } from "react-icons/bs";
import { PiFileAudioBold } from "react-icons/pi";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { deleteResource } from "@/lib/actions/delete-resource";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  return (
    <div className="flex items-center justify-between px-4 sm:px-6 py-3 hover:bg-muted/30 group transition-colors border-b rounded-md">
      <div className="flex items-center gap-3 min-w-0 flex-1 pr-3">
        <span className="size-8 rounded bg-muted flex items-center justify-center text-muted-foreground">
          {resourceKind === "pdf" ? (
            <BsFiletypePdf className="size-4" />
          ) : resourceKind === "doc" ||
            resourceKind === "docx" ||
            resourceKind === "txt" ? (
            <FileText className="size-4" />
          ) : resourceKind === "jpg" ||
            resourceKind === "jpeg" ||
            resourceKind === "png" ||
            resourceKind === "gif" ||
            resourceKind === "webp" ||
            resourceKind === "image" ? (
            <BsFileImage className="size-4" />
          ) : resourceKind === "xls" ||
            resourceKind === "xlsx" ||
            resourceKind === "excel" ? (
            <BsFiletypeExe className="size-4" />
          ) : resourceKind === "mp3" || resourceKind === "audio" ? (
            <PiFileAudioBold className="size-4" />
          ) : (
            <FileText className="size-4" />
          )}
        </span>
        <div className="min-w-0">
          <Link href={`/admin/companies/${companyId}/resources/${resourceId}`}>
            <p className="text-sm font-medium text-foreground truncate">
              {resourceName}
            </p>
            {resourceDescription && (
              <span className="text-xs text-muted-foreground truncate">
                {resourceDescription}
              </span>
            )}
          </Link>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
          >
            <MoreHorizontal className="size-4 text-muted-foreground" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              router.push(
                `/admin/companies/${companyId}/resources/${resourceId}`
              );
            }}
          >
            View
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              router.push(
                `/admin/companies/${companyId}/resources/${resourceId}/edit`
              );
            }}
          >
            Edit
          </DropdownMenuItem>
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
  );
};

export default ResourceCard;
