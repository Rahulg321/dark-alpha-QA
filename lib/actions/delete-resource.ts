"use server";

import { embeddings, resources } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { db } from "../db/queries";
import { auth } from "@/app/(auth)/auth";
import { revalidatePath } from "next/cache";

export async function deleteResource(resourceId: string, companyId: string) {
  const userSession = await auth();

  if (!userSession?.user?.id) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }
  if (!companyId) {
    return {
      success: false,
      message: "Company ID is required",
    };
  }

  if (!resourceId) {
    return {
      success: false,
      message: "Resource ID is required",
    };
  }

  try {
    await db.delete(embeddings).where(eq(embeddings.resourceId, resourceId));
    await db.delete(resources).where(eq(resources.id, resourceId));

    revalidatePath(`/admin/companies/${companyId}`);

    return {
      success: true,
      message: "Resource deleted successfully",
    };
  } catch (error) {
    console.log("an error while deleting resource");

    console.error(error);
    return {
      success: false,
      message: "Failed to delete resource",
    };
  }
}
