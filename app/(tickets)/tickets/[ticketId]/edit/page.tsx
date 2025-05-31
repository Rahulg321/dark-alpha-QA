import EditTicketForm from "@/components/forms/edit-ticket-form";
import React from "react";
import { getTicketById } from "@/app/(tickets)/actions"

type Params = Promise<{ ticketId: string}>;

const EditTicketPage = async (props: {params: Params}) => {
  const { ticketId } = await props.params;
  const fetchedTicket = await getTicketById(ticketId);

  return (
    <section className="block-space big-container">
    <h2 className="">Edit the Ticket</h2>
    <EditTicketForm ticket={fetchedTicket[0]}/>
    </section>
  );
};

export default EditTicketPage;
