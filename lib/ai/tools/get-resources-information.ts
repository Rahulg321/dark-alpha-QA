import { tool } from "ai";
import { z } from "zod";
import compareResourcesInfomation from "../compare-resources-information";

export const getResourcesInformation = tool({
  description: `MANDATORY: You MUST use this tool when the user has selected specific resources for context. This tool is REQUIRED to retrieve and analyze the content of the selected resources before providing any response. 

For comprehensive requests (asking for complete information, summaries, or general descriptions), this tool will return ALL content from the selected resources.

For specific queries, this tool will return the most relevant content chunks based on semantic similarity.

Do not proceed with your answer until you have called this tool with the user's question and the provided resource IDs. This tool will ground your response in the context of the selected resources.`,
  parameters: z.object({
    question: z.string().describe("the users question"),
    resources: z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
        })
      )
      .describe("the resources selected and provided by the user"),
  }),
  execute: async ({ question, resources }) => {
    console.log("=== getResourcesInformation tool called ===");
    console.log("Question:", question);
    console.log("Resources:", resources);

    try {
      const results = await compareResourcesInfomation(question, resources);
      console.log("Tool execution completed. Results:", results);

      if (!results || results.length === 0) {
        return {
          message:
            "No relevant information found in the selected resources for your question.",
          resources: resources.map((r) => r.name),
          question: question,
          totalContentLength: 0,
          isComplete: false,
        };
      }

      // Calculate total content length and check if any results are complete
      const totalContentLength = results.reduce(
        (sum, result) => sum + result.content.length,
        0
      );
      const hasCompleteResults = results.some((result) => result.isComplete);

      const responseMessage = hasCompleteResults
        ? "Found complete information from the selected resources. All content has been retrieved and is available for analysis."
        : "Found relevant information from the selected resources based on your specific query.";

      return {
        message: responseMessage,
        results: results,
        resources: resources.map((r) => r.name),
        question: question,
        totalContentLength: totalContentLength,
        isComplete: hasCompleteResults,
        summary: {
          totalResources: results.length,
          totalChunks: results.length,
          averageSimilarity:
            results.reduce((sum, r) => sum + r.similarity, 0) / results.length,
          contentBreakdown: results.map((r) => ({
            name: r.name,
            contentLength: r.content.length,
            similarity: r.similarity,
            isComplete: r.isComplete,
          })),
        },
      };
    } catch (error) {
      console.error("Error in getResourcesInformation:", error);
      return {
        message: "Error retrieving information from selected resources.",
        error: error instanceof Error ? error.message : "Unknown error",
        resources: resources.map((r) => r.name),
        question: question,
        totalContentLength: 0,
        isComplete: false,
      };
    }
  },
});
