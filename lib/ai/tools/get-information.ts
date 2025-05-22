import { createResource } from '@/lib/actions/resources';
import { tool } from 'ai';
import { z } from 'zod';
import { findRelevantContent } from '../embedding';

export const getInformation = tool({
    description: `Answer any question about the financial, operational, and inner workings of Dark Alpha Capital. If a user asks related to something specific realted to Dark Alpha Capital and its operations then use this tool, use this tool and vector store to answer the question.`,
    parameters: z.object({
      question: z.string().describe('the users question'),
    }),
    execute: async ({ question }) => {
        console.log("Getting information for question:", question);
        const relevantContent = await findRelevantContent(question);
        console.log("Relevant content found:", relevantContent);
        return relevantContent;
    },
  });