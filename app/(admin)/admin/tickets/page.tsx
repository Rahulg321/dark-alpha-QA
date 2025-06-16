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
import StatusTicketFilter from "./StatusTicketFilter";
import TicketPaginationFilter from "./TicketPaginationFilter";
import TicketTypeFilter from "./TicketTypeFilter";
import SearchTicketFilter from "./SearchTicketFilter";

export const metadata = {
  title: "Support Tickets",
  description: "Manage website submissions and email-based support requests.",
};

export default async function AdminTickets({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const status = (await searchParams).status as string;
  const type = (await searchParams).type as string;
  const query = (await searchParams).query as string;
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const limit = 50;
  const offset = (currentPage - 1) * limit;

  return (
    <div className="min-h-screen bg-background group">
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
            <StatusTicketFilter />
            <TicketTypeFilter />
            <SearchTicketFilter />
          </div>
        </div>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              <TicketCardSkeleton />
              <TicketCardSkeleton />
              <TicketCardSkeleton />
              <TicketCardSkeleton />
              <TicketCardSkeleton />
              <TicketCardSkeleton />
              <TicketCardSkeleton />
              <TicketCardSkeleton />
              <TicketCardSkeleton />
            </div>
          }
        >
          <TicketCards
            status={status}
            type={type}
            currentPage={currentPage}
            limit={limit}
            offset={offset}
            query={query}
          />
        </Suspense>
      </div>
    </div>
  );
}

async function TicketCards({
  status,
  type,
  currentPage,
  limit,
  offset,
  query,
}: {
  status: string;
  type: string;
  currentPage: number;
  limit: number;
  offset: number;
  query: string;
}) {
  const { tickets, totalPages, totalTickets } = await getFilteredTickets(
    status,
    limit,
    offset,
    type,
    query
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          {tickets.length} {tickets.length === 1 ? "ticket" : "tickets"} found
        </h2>
        {currentPage && (
          <div>
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
            {/* <p className="text-sm text-muted-foreground">
              {totalTickets} Total tickets
            </p> */}
          </div>
        )}
        {totalPages > 1 && <TicketPaginationFilter totalPages={totalPages} />}
      </div>
      <div className="grid grid-cols-1 group-has-[[data-pending]]:animate-pulse lg:grid-cols-2 xl:grid-cols-3 gap-4">
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
      </div>
    </div>
  );
}
