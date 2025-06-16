import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  Clock,
  Mail,
  MessageSquare,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getFilteredTickets } from "@/lib/db/queries";
import { Suspense } from "react";
import TicketCardSkeleton from "@/components/skeletons/TicketCardSkeleton";

export default function AdminTickets() {
  return (
    <div className="min-h-screen bg-background">
      <div className="big-container block-space-mini">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight mb-2">
            Support Tickets
          </h1>
          <p className="text-muted-foreground">
            Manage website submissions and email-based support requests.
          </p>
        </header>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm">
              Open
            </Button>
            <Button variant="ghost" size="sm">
              Closed
            </Button>
            <Button variant="ghost" size="sm">
              All
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Mail className="size-3 mr-1" />
              Email Tickets
            </Button>
            <Button variant="outline" size="sm">
              <MessageSquare className="size-3 mr-1" />
              Website Tickets
            </Button>
            <Button variant="outline" size="sm">
              High Priority
            </Button>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              <TicketCardSkeleton />
              <TicketCardSkeleton />
              <TicketCardSkeleton />
            </div>
          }
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            <TicketCards />
          </div>
        </Suspense>
      </div>
    </div>
  );
}

async function TicketCards() {
  const tickets = await getFilteredTickets();

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

  return (
    <>
      {tickets.map((ticket) => (
        <Card
          key={ticket.id}
          className="group hover:shadow-md transition-all duration-200 border-border"
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                {getStatusIcon(ticket.status)}
                <Badge variant="outline" className="text-xs">
                  {ticket.type}
                </Badge>
                <Badge
                  variant={getPriorityColor(ticket.priority)}
                  className="text-xs"
                >
                  {ticket.priority}
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
                  <DropdownMenuItem>
                    Mark as {ticket.status === "open" ? "Closed" : "Open"}
                  </DropdownMenuItem>
                  <DropdownMenuItem>Change Priority</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Link href={`/admin/tickets/${ticket.id}`} className="block group">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-lg group-hover:text-foreground/80 transition-colors line-clamp-1 flex-1">
                  {ticket.title}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {ticket.type}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
                {ticket.description}
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <User className="size-3" />
                  <span className="truncate">{ticket.fromName}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    <span>{ticket.createdAt.toLocaleString()}</span>
                  </div>
                  <span className="capitalize">{ticket.status}</span>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
