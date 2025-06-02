import { createResource } from "@/lib/actions/resources";
import { tool } from "ai";
import { z } from "zod";
import { findRelevantForASpecificCompany } from "../embedding";

export const screenQuestionCompany = tool({
  description: `Answer any question about the financial, operational, and inner workings of a company. If a user asks related to something specific realted to the company and its operations then use this tool, use this tool and vector store to answer the question.`,
  parameters: z.object({
    question: z.string().describe("the users question"),
    companyId: z.string().describe("the company id"),
  }),
  execute: async ({ question, companyId }) => {
    console.log(
      "Getting information for a specific company question:",
      question
    );
    try {
      const relevantContent = await findRelevantForASpecificCompany(
        question,
        companyId
      );
      console.log("Relevant content found:", relevantContent);
      return relevantContent;
    } catch (error) {
      console.error(
        "Error getting information for a specific company question:",
        error
      );
      return {
        error: "Error getting information for a specific company question",
      };
    }
  },
});
