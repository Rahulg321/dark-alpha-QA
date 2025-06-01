"use server";

import { companyQuestions as companyQuestionsTable } from "@/lib/db/schema";
import { db } from "../db/queries";
import { auth } from "@/app/(auth)/auth";

export async function bulkAddQuestions(
  companyId: string,
  questions: { title: string }[]
) {
  const userSession = await auth();

  if (!userSession?.user) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  if (!questions || questions.length === 0) {
    return {
      success: false,
      message: "No questions provided",
    };
  }

  try {
    const companyQuestions = await db.insert(companyQuestionsTable).values(
      questions.map((question) => ({
        companyId,
        title: question.title,
      }))
    );

    console.log("all company questions were inserted successfully");

    return {
      success: true,
      message: "Questions added successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to add questions",
    };
  }
}
