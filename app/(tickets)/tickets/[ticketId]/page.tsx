import React from "react";
import { getTicketById } from "@/lib/db/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const { ticketId } = await params;
  const ticket = await getTicketById({ id: ticketId });

  return {
    title: `Ticket ${ticket.title}`,
    description: `Ticket ${ticket.title} with tags ${ticket.tags.join(", ")}`,
  };
}

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
      <ul>
        {ticket.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>

      <p>{ticketId}</p>
      <p>{ticket.title}</p>
      <p>{ticket.description}</p>
      <p>{ticket.status}</p>
      <p>{ticket.createdAt.toISOString()}</p>

      <p>View Replies</p>
    </div>
  );
};

export default SpecificTicketPage;
