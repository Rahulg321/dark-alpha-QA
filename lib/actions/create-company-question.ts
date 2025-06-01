"use server";

import { createCompanyQuestionSchema } from "@/lib/schemas/create-company-question";
import { companyQuestions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/app/(auth)/auth";
import { db } from "@/lib/db/queries";
import { revalidatePath } from "next/cache";

export async function createCompanyQuestion(
  companyId: string,
  values: z.infer<typeof createCompanyQuestionSchema>
) {
  const userSession = await auth();

  if (!userSession) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  const validatedValues = createCompanyQuestionSchema.safeParse(values);

  if (!validatedValues.success) {
    return {
      success: false,
      message: "Invalid values",
    };
  }

  try {
    const [question] = await db
      .insert(companyQuestions)
      .values({
        title: validatedValues.data.title,
        companyId,
      })
      .returning();

    revalidatePath(`/admin/companies/${companyId}/questions`);

    return {
      success: true,
      message: "Question created successfully",
      questionId: question.id,
    };
  } catch (error) {
    console.error("Failed to create question:", error);
    return {
      success: false,
      message: "Failed to create question",
    };
  }
}
