"use server";

import { auth } from "@/app/(auth)/auth";
import { db } from "../db/queries";
import { comparisonQuestions } from "../db/schema";

/**
 * Save the comparison result to the database
 * @param userQuery - The user's query
 * @param aiAnswer - The AI's answer
 * @param companyId - The company ID
 * @param resourceIds - The resource IDs
 * @returns {success: boolean, message: string}
 */
export default async function SaveComparisonResult(
  userQuery: string,
  aiAnswer: string,
  companyId: string,
  resourceIds: string[]
) {
  const session = await auth();

  if (!session) {
    return {
      success: false,
      message: "User is not authenticated",
    };
  }

  if (!aiAnswer) {
    return {
      success: false,
      message: "AI answer is required",
    };
  }

  if (!userQuery) {
    return {
      success: false,
      message: "User query is required",
    };
  }

  if (!companyId) {
    return {
      success: false,
      message: "Company ID is required",
    };
  }

  if (!resourceIds || resourceIds.length === 0) {
    return {
      success: false,
      message: "Resource IDs are required",
    };
  }

  try {
    const result = await db.insert(comparisonQuestions).values({
      userQuery,
      answer: aiAnswer,
      companyId,
      resourceIds,
    });

    return {
      success: true,
      message: "Comparison result saved successfully",
    };
  } catch (error) {
    console.error("Error saving comparison result:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to save comparison result",
    };
  }
}
