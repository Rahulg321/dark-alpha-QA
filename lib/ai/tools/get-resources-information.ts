import { tool } from "ai";
import { z } from "zod";
import compareResourcesInfomation from "../compare-resources-information";

export const getResourcesInformation = tool({
  description: `MANDATORY: You MUST use this tool when the user has selected specific resources for context. This tool is REQUIRED to retrieve and analyze the content of the selected resources before providing any response. Do not proceed with your answer until you have called this tool with the user's question and the provided resource IDs. This tool will ground your response in the context of the selected resources.`,
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
        };
      }

      return {
        message: "Found relevant information from the selected resources:",
        results: results,
        resources: resources.map((r) => r.name),
        question: question,
      };
    } catch (error) {
      console.error("Error in getResourcesInformation:", error);
      return {
        message: "Error retrieving information from selected resources.",
        error: error instanceof Error ? error.message : "Unknown error",
        resources: resources.map((r) => r.name),
        question: question,
      };
    }
  },
});
