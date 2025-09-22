import { tool } from "ai";
import { z } from "zod";
import { enhancedRAGSearch } from "../enhanced-rag";

export const enhancedInformationSearch = tool({
  description: `Advanced information search tool that searches across the ENTIRE database including:
  - Vector embeddings from all uploaded documents and resources
  - Company profiles and information
  - Support tickets and customer interactions  
  - Q&As and knowledge base entries
  - Previous chat conversations and context
  - All documents and artifacts

This tool automatically searches ALL available data sources to provide comprehensive, grounded responses. Use this when you need to find information that might be scattered across different parts of the system.

Unlike the basic getResourcesInformation tool which only works with pre-selected resources, this tool searches everything and finds the most relevant information regardless of where it's stored.`,
  parameters: z.object({
    query: z.string().describe("The search query - can be a question, topic, company name, or any information you need to find"),
    companyId: z.string().optional().describe("Optional: Filter results to a specific company ID if the user is asking about a particular company"),
    maxResults: z.number().optional().describe("Optional: Maximum number of results to return (default: 15)"),
    focusAreas: z.array(z.enum([
      'embeddings', 
      'companies', 
      'tickets', 
      'qas', 
      'chats', 
      'documents'
    ])).optional().describe("Optional: Specific areas to focus the search on. If not provided, searches all areas."),
  }),
  execute: async ({ query, companyId, maxResults = 15, focusAreas }) => {
    try {
      console.log("Enhanced information search for query:", query);
      console.log("Company filter:", companyId);
      console.log("Focus areas:", focusAreas);

      // Configure search options based on focus areas
      const searchOptions: any = {
        maxResults,
        companyId,
      };

      if (focusAreas && focusAreas.length > 0) {
        // If specific focus areas are provided, enable only those
        searchOptions.includeEmbeddings = focusAreas.includes('embeddings');
        searchOptions.includeCompanies = focusAreas.includes('companies');
        searchOptions.includeTickets = focusAreas.includes('tickets');
        searchOptions.includeQAs = focusAreas.includes('qas');
        searchOptions.includeChats = focusAreas.includes('chats');
        searchOptions.includeDocs = focusAreas.includes('documents');
      }
      // If no focus areas specified, search everything (default behavior)

      const searchResults = await enhancedRAGSearch(query, searchOptions);

      if (searchResults.searchResults.length === 0) {
        return {
          success: false,
          message: "No relevant information found in the database for your query.",
          query,
          totalResults: 0,
          searchedAreas: focusAreas || ['all'],
        };
      }

      // Format results for AI consumption
      const formattedResults = searchResults.searchResults.map((result, index) => ({
        rank: index + 1,
        source: result.type,
        title: result.title,
        content: result.content,
        similarity: result.similarity?.toFixed(3) || 'N/A',
        metadata: result.metadata,
        resourceId: result.resourceId,
        companyId: result.companyId,
      }));

      return {
        success: true,
        message: `Found comprehensive information across ${searchResults.contextSummary.totalSources} sources in the database.`,
        query,
        totalResults: searchResults.searchResults.length,
        sourcesBreakdown: searchResults.contextSummary.sourcesBreakdown,
        averageSimilarity: searchResults.contextSummary.averageSimilarity.toFixed(3),
        highestSimilarity: searchResults.contextSummary.highestSimilarity.toFixed(3),
        results: formattedResults,
        rawContext: searchResults.rawContext,
        searchedAreas: focusAreas || ['embeddings', 'companies', 'tickets', 'qas', 'chats', 'documents'],
        instructions: "Use the above information as the foundation for your response. The 'rawContext' contains all the relevant information found in the database. Reference specific sources and provide comprehensive answers based on this grounded information."
      };
    } catch (error) {
      console.error("Error in enhanced information search:", error);
      return {
        success: false,
        message: "An error occurred while searching the database.",
        error: error instanceof Error ? error.message : "Unknown error",
        query,
        totalResults: 0,
      };
    }
  },
});