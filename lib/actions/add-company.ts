"use server";

import { db } from "../db/queries";
import { newCompanySchema } from "../schemas/new-company-schema";
import { auth } from "../../app/(auth)/auth";
import { z } from "zod";
import { company } from "../db/schema";

export async function addCompany(values: z.infer<typeof newCompanySchema>) {
  const userSession = await auth();
  if (!userSession) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const validatedData = newCompanySchema.safeParse(values);
    if (!validatedData.success) {
      return {
        success: false,
        message: "Invalid form data",
      };
    }

    const [insertedCompany] = await db
      .insert(company)
      .values({
        name: validatedData.data.name,
        type: validatedData.data.type,
        website: validatedData.data.website,
        email: validatedData.data.email,
        address: validatedData.data.address,
        description: validatedData.data.description,
        industry: validatedData.data.industry,
      })
      .returning();

    return {
      success: true,
      message: "Company added successfully",
      company: insertedCompany,
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to add company" };
  }
}
