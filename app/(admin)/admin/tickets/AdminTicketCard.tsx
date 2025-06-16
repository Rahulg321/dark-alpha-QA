"use client";

import { Badge } from "@/components/ui/badge";

import { Ticket } from "@/lib/db/schema";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  Mail,
  MessageSquare,
  MoreHorizontal,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { updateTicketStatus } from "@/lib/actions/update-ticket-status";
import { toast } from "sonner";
import { deleteTicketByAdmin } from "@/lib/actions/delete-admin-ticket";

export default function AdminTicketCard({
  ticketId,
  status,
  type,
  priority,
  title,
  description,
  fromName,
  createdAt,
}: {
  ticketId: string;
  status: "open" | "closed";
  type: "email" | "website";
  priority: "low" | "medium" | "high";
  title: string;
  description: string;
  fromName: string;
  createdAt: Date;
}) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="size-4 text-orange-500" />;
      case "closed":
        return <CheckCircle className="size-4 text-green-500" />;
      default:
        return <Clock className="size-4 text-muted-foreground" />;
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "email":
        return <Mail className="size-4 text-blue-500" />;
      case "website":
        return <MessageSquare className="size-4 text-green-500" />;
      default:
        return <MessageSquare className="size-4 text-muted-foreground" />;
    }
  };
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="group hover:shadow-md transition-all duration-200 border-border">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            {getStatusIcon(status)}
            <Badge variant="outline" className="text-xs">
              {type}
            </Badge>
            <Badge variant={getPriorityColor(priority)} className="text-xs">
              {priority}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={async () => {
                  let response;
                  if (status === "open") {
                    response = await updateTicketStatus(ticketId, "closed");
                  } else {
                    response = await updateTicketStatus(ticketId, "open");
                  }

                  if (response?.success) {
                    toast.success(response.message);
                  } else {
                    toast.error(
                      response?.message ?? "Failed to update ticket status"
                    );
                  }
                }}
              >
                Mark as {status === "open" ? "Closed" : "Open"}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={async () => {
                  const response = await deleteTicketByAdmin(ticketId);
                  if (response?.success) {
                    toast.success(response.message);
                  } else {
                    toast.error(response?.message ?? "Failed to delete ticket");
                  }
                }}
              >
                Delete Ticket
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Link href={`/admin/tickets/${ticketId}`} className="block group">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-lg group-hover:text-foreground/80 transition-colors line-clamp-1 flex-1">
              {title}
            </h3>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
            {description}
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <User className="size-3" />
              <span className="truncate">{fromName}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="size-3" />
                <span>{createdAt.toLocaleString()}</span>
              </div>
              <span className="capitalize">{status}</span>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
