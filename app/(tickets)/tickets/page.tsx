import { TicketCard } from "@/components/ticket-card";
import { Button } from "@/components/ui/button";
import { Ticket } from "@/lib/db/schema";
import React from "react";
import Link from "next/link";
import { getAllTickets } from "@/lib/db/queries";
import { PlusCircle } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tickets",
  description: "Tickets",
};

const TicketsPage = async () => {
  const tickets = await getAllTickets();

  return (
    <section className="block-space big-container">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tickets</h1>
        <div className="flex justify-end">
          <Button variant="default" className="rounded-full" asChild>
            <Link href="/tickets/new">
              <PlusCircle className="size-4" />
              New Ticket
            </Link>
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 md:mt-8">
        {tickets.length === 0 && (
          <div className="col-span-2">
            <p>No tickets found</p>
            <Button asChild>
              <Link href="/tickets/new">Create a new ticket</Link>
            </Button>
          </div>
        )}

        {tickets.length > 0 &&
          tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
      </div>
    </section>
  );
};

export default TicketsPage;
