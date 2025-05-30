import React from 'react'
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ReplyCard } from '@/components/reply-card';
import GetReplies, { GetAllReplies } from "@/app/actions/get-replies";

const SpecificTicketPage = async ({params}:{params:Promise<{ticketId:string}>}) => {
  const {ticketId} = await params;
  const { data } = await GetAllReplies({ ticketId });
  const newReplyLink = `/tickets/${ticketId}/reply`;

  return (
    <section className="block-space big-container">
    <div>
        <h1>Specific Ticket Page</h1>
        <p>{ticketId}</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Button asChild>
    <Link href={newReplyLink}>New Reply</Link>
    </Button>
    </div><div className="group-has-[[data-pending]]:animate-pulse">
    {data.length === 0 ? (
      <div className="mt-12 text-center">
      <p className="text-xl text-muted-foreground">
      No replies.
      </p>
      </div>
    ) : (
      data.map((reply) => (
        <ReplyCard key={reply.id} reply={reply} />
      ))
    )}
    </div>
    </section>
  )
}

export default SpecificTicketPage
