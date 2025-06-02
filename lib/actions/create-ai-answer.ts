"use server";

import { auth } from "@/app/(auth)/auth";
import { db } from "../db/queries";
import { answers } from "../db/schema";
import { revalidatePath } from "next/cache";

/**
 * Create an AI answer for a company question
 * @param companyId - The ID of the company
 * @param companyQuestionId - The ID of the company question
 * @param answerText - The text of the answer
 * @returns The ID of the answer
 */
export async function createAiAnswer(
  companyId: string,
  companyQuestionId: string,
  answerText: string
) {
  const userSession = await auth();

  if (!userSession?.user) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  if (!companyId || !companyQuestionId) {
    return {
      success: false,
      message: "Company ID and company question ID are required",
    };
  }

  if (!answerText) {
    return {
      success: false,
      message: "Answer text is required",
    };
  }

  try {
    const [answer] = await db
      .insert(answers)
      .values({
        companyQuestionId,
        answer: answerText,
        type: "AI_GENERATED",
      })
      .returning();

    revalidatePath(
      `/admin/companies/${companyId}/questions/${companyQuestionId}`
    );

    revalidatePath(`/admin/companies/${companyId}/questions`);

    return {
      success: true,
      message: "AI answer created successfully",
      answerId: answer.id,
      answerText: answer.answer,
    };
  } catch (error) {
    console.error("Failed to create AI answer:", error);
    return {
      success: false,
      message: "Failed to create AI answer",
    };
  }
}
