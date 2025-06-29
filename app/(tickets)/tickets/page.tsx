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

  return <section className="block-space big-container"></section>;
};

export default TicketsPage;
