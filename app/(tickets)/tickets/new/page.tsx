import NewTicketForm from "@/components/forms/new-ticket-form";
import React from "react";

const NewTicketPage = () => {
  return (
    <section className="block-space big-container">
      <h2 className="">Add a new Ticket</h2>
      <NewTicketForm />
    </section>
  );
};

export default NewTicketPage;
