"use server";

import { auth } from "@/app/(auth)/auth";
import { db } from "@/lib/db/queries";
import { companyQuestions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteQuestion(questionId: string, companyId: string) {
  const userSession = await auth();

  if (!userSession) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  if (!questionId || !companyId) {
    return {
      success: false,
      message: "Invalid question or company id",
    };
  }

  try {
    await db
      .delete(companyQuestions)
      .where(eq(companyQuestions.id, questionId));

    revalidatePath(`/admin/companies/${companyId}/questions`);

    return {
      success: true,
      message: "Question deleted successfully",
    };
  } catch (error) {
    console.error("Failed to delete question:", error);
    return {
      success: false,
      message: "Failed to delete question",
    };
  }
}
