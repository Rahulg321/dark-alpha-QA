import TicketHeader from "@/components/TicketHeader";
import TicketFooter from "@/components/TicketFooter";
import React from "react";
import { auth } from "../(auth)/auth";
import { redirect } from "next/navigation";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <TicketHeader session={session} />
      {children}
    </div>
  );
};

export default layout;
