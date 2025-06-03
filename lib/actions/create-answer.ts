"use server";

import { auth } from "@/app/(auth)/auth";
import {
  AddAnswerFormValues,
  addAnswerSchema,
} from "@/lib/schemas/add-answer-schema";
import { answers } from "../db/schema";
import { db } from "../db/queries";
import { revalidatePath } from "next/cache";

/**
 * Add an answer for a company question
 * @param companyId - The ID of the company
 * @param companyQuestionId - The ID of the company question
 * @param values - The values of the form
 * @returns - The result of the action
 */
export async function AddAnswerForCompanyQuestion(
  companyId: string,
  companyQuestionId: string,
  values: AddAnswerFormValues
) {
  const userSession = await auth();

  if (!userSession) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  const { success, data } = addAnswerSchema.safeParse(values);

  if (!success) {
    return {
      success: false,
      message: "Invalid form data",
    };
  }

  try {
    const answer = await db.insert(answers).values({
      companyQuestionId: companyQuestionId,
      answer: data.content,
      type: "MANUAL",
    });

    revalidatePath(
      `/admin/companies/${companyId}/questions/${companyQuestionId}`
    );

    revalidatePath(`/admin/companies/${companyId}`);

    return {
      success: true,
      message: "Answer created successfully",
    };
  } catch (error) {
    console.error("Error creating answer", error);
    return {
      success: false,
      message: "Error creating answer",
    };
  }
}
