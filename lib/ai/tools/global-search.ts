import { tool } from "ai";
import { z } from "zod";
import { chatRAGSearch } from "../enhanced-rag";

export const globalSearch = tool({
  description: `Global search tool that automatically searches across ALL data in the system when no specific resources are selected. This tool is your PRIMARY search capability and should be used whenever you need to find information.

This tool searches:
- ALL vector embeddings from uploaded documents
- Company profiles and business information
- Support tickets and customer issues
- Q&A knowledge base entries
- Previous chat conversations
- User documents and artifacts
- All other database content

Use this tool FIRST when answering any question that requires information lookup, especially when:
- No specific resources have been selected by the user
- You need comprehensive information about a topic
- You want to find relevant context from anywhere in the system
- The user asks general questions about companies, processes, or topics

This tool will automatically find and retrieve the most relevant information to ground your response.`,
  parameters: z.object({
    query: z.string().describe("The search query - what information are you looking for?"),
    context: z.string().optional().describe("Optional additional context about what the user is asking for"),
  }),
  execute: async ({ query, context }) => {
    try {
      console.log("Global search initiated for:", query);
      if (context) {
        console.log("Additional context:", context);
      }

      // Enhance the search query with context if provided
      const enhancedQuery = context ? `${query} ${context}` : query;
      
      const ragContext = await chatRAGSearch(enhancedQuery);

      if (ragContext === "No relevant information found in the database for your query.") {
        return {
          success: false,
          message: "No relevant information found in the database for your query. The system searched across all available data sources including documents, companies, tickets, Q&As, chats, and more.",
          query: enhancedQuery,
          contextFound: false,
        };
      }

      return {
        success: true,
        message: "Found relevant information across multiple data sources in the system.",
        query: enhancedQuery,
        contextFound: true,
        context: ragContext,
        instructions: "Use the above context as the foundation for your response. This information comes from the comprehensive database search across all available sources. Provide a detailed, accurate answer based on this grounded information. Reference specific sources where relevant and ensure your response is comprehensive."
      };
    } catch (error) {
      console.error("Error in global search:", error);
      return {
        success: false,
        message: "An error occurred while searching the database.",
        error: error instanceof Error ? error.message : "Unknown error",
        query,
        contextFound: false,
      };
    }
  },
});