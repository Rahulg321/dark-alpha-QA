'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addReply(ticketId: string, formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  if (!name || !email || !message) {
    throw new Error('All fields are required');
  }

  try {
    console.log('Creating reply with data:', {
      ticketId,
      body: message,
      fromName: name,
      fromEmail: email,
      isAdmin: false,
    });

    const reply = await prisma.reply.create({
      data: {
        ticketId,
        body: message,
        fromName: name,
        fromEmail: email,
        isAdmin: false,
      },
    });

    console.log('Reply created successfully:', reply);

    revalidatePath(`/tickets/${ticketId}`);
    redirect(`/tickets/${ticketId}`);
  } catch (error) {
    console.error('Error adding reply:', error);
    throw new Error('Failed to add reply');
  }
}