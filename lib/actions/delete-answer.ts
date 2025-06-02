"use server";

import { auth } from "@/app/(auth)/auth";
import { answers } from "../db/schema";
import { db } from "../db/queries";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function DeleteAnswer(
  companyId: string,
  questionId: string,
  answerId: string
) {
  const userSession = await auth();

  if (!userSession) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  if (!answerId) {
    return {
      success: false,
      message: "Answer ID is required",
    };
  }

  if (!companyId || !questionId) {
    return {
      success: false,
      message: "Company ID and question ID are required",
    };
  }

  try {
    await db.delete(answers).where(eq(answers.id, answerId));

    revalidatePath(`/admin/companies/${companyId}`);
    revalidatePath(`/admin/companies/${companyId}/questions/${questionId}`);

    return {
      success: true,
      message: "Answer deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting answer", error);
    return {
      success: false,
      message: "Error deleting answer",
    };
  }
}
