import TicketsClient from "@/components/tickets/TicketsClient";
import { getAllTicketsWithReplyCounts } from "@/lib/db/queries";

export const metadata = {
  title: 'Support Tickets',
  description: 'Track and manage your support requests.',
};

const TicketsPage = async () => {
  const tickets = await getAllTicketsWithReplyCounts();

  return <TicketsClient tickets={tickets} />;
};

export default TicketsPage;
