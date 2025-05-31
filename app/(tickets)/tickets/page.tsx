import { TicketCard } from "@/components/ticket-card";
import { Button } from "@/components/ui/button";
import { Ticket } from "@/lib/db/schema";
import React from "react";
import SearchTickets from "@/components/SearchTickets";
import Link from "next/link";
import GetTickets, { GetAllTickets } from "@/app/actions/get-tickets";
import Pagination from "@/components/pagination";

type SearchParams = Promise<{ [key: string]: string | undefined }>;

const TicketsPage = async (props: { searchParams: SearchParams }) => {
  const searchParams = await props.searchParams;
  const search = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 20;
  const offset = (currentPage - 1) * limit;
  const ticketStatus =
    typeof searchParams?.ticketStatus === "string"
      ? [searchParams.ticketStatus]
      : searchParams.ticketStatus || [];
  const { data, totalPages, totalCount } = await GetAllTickets({
    search,
    offset,
    limit,
    ticketStatus: ticketStatus as TicketStatus[],
  });

  /**
   * < div c*lassName="flex flex-wrap items-center gap-4">
   * <SearchTickets />
   * </div>
   */
  return (
    <section className="block-space big-container">
      <SearchTickets />
      <Button asChild>
        <Link href="/tickets/new">New Ticket</Link>
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        </div><div className="group-has-[[data-pending]]:animate-pulse">
        {data.length === 0 ? (
          <div className="mt-12 text-center">
          <p className="text-xl text-muted-foreground">
          No tickets found matching your criteria.
          </p>
          </div>
        ) : (
          data.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))
        )}
        </div>
        <Pagination totalPages={totalPages} />
    </section>
  );
};

export default TicketsPage;
