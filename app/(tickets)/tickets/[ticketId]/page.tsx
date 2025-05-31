import React from "react";
import { getTicketById } from "@/lib/db/queries";

const SpecificTicketPage = async ({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) => {
  const { ticketId } = await params;
  const ticket = await getTicketById({ id: ticketId });

  if (!ticket) {
    return <div>Ticket not found</div>;
  }

  return (
    <div className="block-space big-container">
      <h1>Specific Ticket Page</h1>
      <p>{ticketId}</p>
      <p>{ticket.title}</p>
      <p>{ticket.description}</p>
      <p>{ticket.status}</p>
      <p>{ticket.createdAt.toISOString()}</p>
    </div>
  );
};

export default SpecificTicketPage;
