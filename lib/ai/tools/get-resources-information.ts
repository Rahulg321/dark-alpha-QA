import { tool } from "ai";
import { z } from "zod";
import compareResourcesInfomation from "../compare-resources-information";

export const getResourcesInformation = tool({
  description: `Use this tool only if the user provides a list of selected resources along with their query. This tool will essentially allow the model to ground its response in the context of the selected resources.`,
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
