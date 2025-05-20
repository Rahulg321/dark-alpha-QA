import { TicketCard } from "@/components/ticket-card";
import { Ticket } from "@/lib/db/schema";
import React from "react";

const TicketsPage = () => {
  const mockTickets: Ticket[] = [
    {
      id: "T-1001",
      title: "Investment Opportunities",
      description:
        "I'm interested in learning more about your early-stage funding options. Could you provide details on minimum investment amounts?",
      status: "open",
      createdAt: new Date("2024-05-15T09:30:00"),
      userId: "U-1001",
    },
    {
      id: "T-1002ewqqw",
      title: "Investment Opportunities",
      description:
        "I'm interested in learning more about your early-stage funding options. Could you provide details on minimum investment amounts?",
      status: "open",
      createdAt: new Date("2024-05-15T09:30:00"),
      userId: "U-1001",
    },
    {
      id: "T-1002",
      title: "Investment Opportunities",
      description:
        "I'm interested in learning more about your early-stage funding options. Could you provide details on minimum investment amounts?",
      status: "closed",
      createdAt: new Date("2024-05-15T09:30:00"),
      userId: "U-1001",
    },
  ];
  return (
    <section className="block-space big-container">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockTickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </section>
  );
};

export default TicketsPage;
