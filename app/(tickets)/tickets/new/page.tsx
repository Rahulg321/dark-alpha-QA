import NewTicketForm from "@/components/forms/new-ticket-form";
import React from "react";

const NewTicketPage = () => {
  return (
    <section className="block-space-mini narrow-container">
      <h2 className="">Add a new Ticket</h2>
      <div className="mt-4 md:mt-8">
        <NewTicketForm />
      </div>
    </section>
  );
};

export default NewTicketPage;
