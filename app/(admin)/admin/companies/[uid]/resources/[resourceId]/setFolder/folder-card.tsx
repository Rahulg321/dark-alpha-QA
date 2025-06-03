"use client";

import React from "react";

import Link from "next/link";
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
import { moveDocument } from "@/lib/actions/move-document";
import { toast } from "sonner";

const FolderCard = ({
  key,
  name,
  documentId,
  companyId,
}: {
  key: string;
  name: string;
  documentId: string;
  companyId: string;
}) => {
  return (
    <Card
    key={key}
    className="group hover:shadow-md transition-all duration-200"
    >
    <CardContent className="p-6">
    <Button onClick={() => {
      moveDocument(documentId, key, companyId);
    }}>
    <h4 className="font-semibold mb-2">{name}</h4>
    </Button>
    </CardContent>
    </Card>
  );
};

export default FolderCard;
