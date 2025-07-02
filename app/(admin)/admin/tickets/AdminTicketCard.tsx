"use client";

import { Badge } from "@/components/ui/badge";
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
  tags = [],
}: {
  ticketId: string;
  status: "open" | "closed";
  type: "email" | "website";
  priority: "low" | "medium" | "high";
  title: string;
  description: string;
  fromName: string;
  createdAt: Date;
  tags?: { tagId: number; tag: { id: number; name: string } }[];
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

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();
    
    if (isToday) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (isYesterday) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  return (
    <Card className="group overflow-hidden hover:shadow-md transition-all duration-200 border-border">
      <CardContent className="p-0">
        {/* Card header with status and priority */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            {getStatusIcon(status)}
            <span className="font-medium text-sm capitalize">{status}</span>
            <Badge variant={getPriorityColor(priority)} className="text-xs">
              {priority} priority
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              {getSourceIcon(type)}
              <span>{type}</span>
            </Badge>
            
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
        </div>

        {/* Card content */}
        <Link href={`/admin/tickets/${ticketId}`} className="block group p-4">
          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">
            {title}
          </h3>
          
          <p className="text-muted-foreground text-sm leading-relaxed my-3 line-clamp-2">
            {description}
          </p>
          
          {/* Display tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {tags.map(tt => (
                <Badge key={tt.tagId} variant="outline" className="text-xs bg-background">
                  {tt.tag.name}
                </Badge>
              ))}
            </div>
          )}
          
          {/* User and date info */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="size-3.5" />
              <span className="truncate">{fromName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="size-3.5" />
              <span>{formatDate(createdAt)}</span>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
