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
import AdminTicketCard from "./AdminTicketCard";

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

  return (
    <>
      {tickets.map((ticket) => (
        <AdminTicketCard
          key={ticket.id}
          ticketId={ticket.id}
          status={ticket.status}
          type={ticket.type}
          priority={ticket.priority}
          title={ticket.title}
          description={ticket.description ?? "No description"}
          fromName={ticket.fromName}
          createdAt={ticket.createdAt}
        />
      ))}
    </>
  );
}
