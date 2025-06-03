"use server";

import { resources } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { db } from "../db/queries";
import { auth } from "@/app/(auth)/auth";
import { revalidatePath } from "next/cache";

export async function getResourcesByFolder(folderId: string) {
  try {
    return await db.select().from(resources).where(eq(resources.folderId, folderId));
  } catch (error) {
    console.log("error")
  }
}
