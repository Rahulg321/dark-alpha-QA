"use server";

import { auth } from "@/app/(auth)/auth";
import { eq } from "drizzle-orm";
import { db } from "../db/queries";
import { company } from "../db/schema";

export async function deleteCompany(companyId: string) {
  const userSession = await auth();

  if (!userSession) {
    return { success: false, message: "Unauthorized" };
  }

  if (!companyId) {
    return { success: false, message: "Company ID is required" };
  }

  try {
    await db.delete(company).where(eq(company.id, companyId));
    return { success: true, message: "Company deleted successfully" };
  } catch {
    return { success: false, message: "Failed to delete company" };
  }
}
