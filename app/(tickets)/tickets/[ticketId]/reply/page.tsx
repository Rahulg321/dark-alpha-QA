import NewReplyForm from "@/components/forms/new-reply-form";
import React from "react";
import { getTicketById } from "@/app/(tickets)/actions"

type Params = Promise<{ ticketId: string}>;

const NewReplyPage = async (props: {params: Params}) => {
  const { ticketId } = await props.params;
  const fetchedTicket = await getTicketById(ticketId);

  return (
    <section className="block-space big-container">
    <h2 className="">Write your reply</h2>
    <NewReplyForm ticket={fetchedTicket[0]}/>
    </section>
  );
};

export default NewReplyPage;
