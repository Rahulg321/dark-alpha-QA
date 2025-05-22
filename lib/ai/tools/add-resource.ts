import { createResource } from '@/lib/actions/resources';
import { tool } from 'ai';
import { z } from 'zod';

export const addResource = tool({
description: `add a resource to your knowledge base.
    If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation. If a user asks you to add a resource, use this tool.`,
  parameters: z.object({
    content: z
      .string()
      .describe('the content or resource to add to the knowledge base'),
  }),
  execute: async ({ content }) => {
    const resource = await createResource({content})
    return resource
  },
});
