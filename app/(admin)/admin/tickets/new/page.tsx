import { redirect } from 'next/navigation';
import { createTicket, type NewTicketInput } from '@/lib/db/queries/createTicket';
import NewTicketForm from './NewTicketForm';

export const metadata = { title: 'New Ticket' };

export default function NewTicketPage() {
  async function handleSubmit(formData: FormData) {
    'use server';

    const payload: NewTicketInput = {
      title:       String(formData.get('title')       ?? '').trim(),
      description: String(formData.get('description') ?? '').trim(),
      priority:    formData.get('priority') as NewTicketInput['priority'],
      type:        formData.get('type')     as NewTicketInput['type'],
      fromName:    String(formData.get('fromName')    ?? '').trim(),
      tags:        (formData.getAll('tags') as string[]).filter(Boolean),
    };

    await createTicket(payload);
    redirect('/admin/tickets');
  }

  return (
    <div className="big-container block-space-mini">
      <h1 className="mb-6 text-3xl font-semibold tracking-tight">New Ticket</h1>
      <NewTicketForm action={handleSubmit} />
    </div>
  );
}
