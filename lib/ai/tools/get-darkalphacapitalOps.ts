import { tool } from 'ai';
import { z } from 'zod';
import { openaiClient } from '../providers';

export const darkAlphaOps = tool({
  description: 'Answer any question about the financial, operational, and inner workings of Dark Alpha Capital. If u hear Dark Alpha Capital, use this tool and vector store to answer the question.',
  parameters: z.object({
    question: z.string().describe("The user's question about Dark Alpha Capital and its financial, operational, and inner workings"),
  }),
  execute: async ({ question }) => {

    console.log("tool was called with question ", question);

    const systemPrompt = `
You are the Dark Alpha Capital Operations Assistant. Your role is to provide authoritative, up-to-date answers on Dark Alpha Capital's:
- Financial performance (P&L, balance sheet, cashflows, KPIs)
- Investment strategy and portfolio construction
- Internal processes (deal sourcing, diligence, risk management)
- Organizational structure and key team responsibilities
- Any other operational or strategic facets of the firm

Always answer with clarity, reference internal policy or data where relevant, and flag any question that requires non-public or sensitive information for escalation.  Use the vector store to answer the question. If you do not have the information, say so.
    `.trim();
    
    const response = await openaiClient.responses.create({
        model: "gpt-4.1",
        tools: [
          {
            type: "file_search",
            vector_store_ids: ["vs_J6ChDdA5z2j0fJKtmoOQnohz"],
            max_num_results: 20,
          },
        ],
        input: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: `Please evaluate the following deal: ${JSON.stringify(question)}`,
          },
        ],
      });
  
      console.log("response ", response);
      console.log("response ", response.output);
  
      // Extract just the annotations and text from the response
      const messageContent = response.output_text;
      console.log("messageContent ", messageContent);
      return messageContent;
  },
});
