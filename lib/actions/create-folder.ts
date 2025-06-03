"use server";

import { createFolderSchema } from "@/lib/schemas/create-folder";
import { folders } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/app/(auth)/auth";
import { db } from "@/lib/db/queries";
import { revalidatePath } from "next/cache";

export async function createFolder(
  name: string,
  companyId: string,
) {

  const userSession = await auth();

  if (!userSession) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  console.log("testing after validation", name)

  try {
    const [folder] = await db
    .insert(folders)
    .values({
      companyId: companyId,
      name: name,
    })
    .returning();

    revalidatePath(`/admin/companies/${companyId}/resources/`);

    return {
      success: true,
      message: "folder created successfully",
      folderId: folder.id,
    };
  } catch (error) {
    console.error("Failed to create folder:", error);
    return {
      success: false,
      message: "Failed to create folder",
    };
  }
}
