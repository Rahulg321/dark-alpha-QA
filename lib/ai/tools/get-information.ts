import { createResource } from '@/lib/actions/resources';
import { tool } from 'ai';
import { z } from 'zod';
import { findRelevantContent } from '../embedding';

export const getInformation = tool({
    description: `get information from your knowledge base to answer questions.`,
    parameters: z.object({
      question: z.string().describe('the users question'),
    }),
    execute: async ({ question }) => findRelevantContent(question),
  });