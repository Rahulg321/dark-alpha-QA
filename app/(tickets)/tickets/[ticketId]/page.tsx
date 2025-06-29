import React from "react";
import { getTicketById, getTicketRepliesByTicketId } from "@/lib/db/queries";
import { auth } from "@/app/(auth)/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const { ticketId } = await params;
  const ticket = await getTicketById({ id: ticketId });

  if (!ticket) {
    return {
      title: "Ticket not found",
      description: "Ticket not found",
    };
  }

  return {
    title: `Ticket ${ticket.Ticket.title}`,
    description: `Ticket ${ticket.Ticket.title} with tags ${ticket.Ticket.tags?.join(", ")}`,
  };
}

const SpecificTicketPage = async ({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) => {
  const userSession = await auth();

  if (!userSession) {
    redirect("/login");
  }

  const { ticketId } = await params;
  const ticket = await getTicketById({ id: ticketId });
  const ticketReplies = await getTicketRepliesByTicketId({ id: ticketId });

  if (!ticket) {
    return <div>Ticket not found</div>;
  }

  return (
    <div className="block-space big-container">
      <div className="flex justify-between items-center">
        <h1>Specific Ticket Page</h1>
        <Button asChild>
          <Link href="/tickets">Back to Tickets</Link>
        </Button>
      </div>

      <span>{ticket.Ticket.description}</span>

      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={ticket.user?.image || ""} />
          <AvatarFallback>{ticket.user?.name?.charAt(0)}</AvatarFallback>
        </Avatar>

        <p>{ticket.user?.name}</p>
      </div>

      <h2>Replies</h2>

      <div className="flex flex-col gap-2">
        {ticketReplies.map((reply) => (
          <div key={reply.id} className="flex items-center gap-2">
            <p>{reply.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpecificTicketPage;
