"use server";

import { resources } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { db } from "../db/queries";
import { auth } from "@/app/(auth)/auth";
import { revalidatePath } from "next/cache";

export async function moveDocument(resourceId: string, folderId: string, companyId: string) {
  const userSession = await auth();

  if (!userSession?.user?.id) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }
  if (!folderId) {
    return {
      success: false,
      message: "Folder ID is required",
    };
  }

  if (!resourceId) {
    return {
      success: false,
      message: "Resource ID is required",
    };
  }

  try {
    await db.update(resources).set({folderId}).where(eq(resources.id, resourceId));

    revalidatePath(`/admin/companies/${companyId}`);

    return {
      success: true,
      message: "Resource moved successfully",
    };
  } catch (error) {
    console.log("an error while moving resource");

    console.error(error);
    return {
      success: false,
      message: "Failed to move resource",
    };
  }
}
