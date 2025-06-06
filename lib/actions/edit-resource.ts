"use server";

import { auth } from "@/app/(auth)/auth";
import { resources } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { db } from "../db/queries";
import { revalidatePath } from "next/cache";

export async function editResource(
  resourceId: string,
  name: string,
  description: string,
  categoryId: string,
  companyId: string
) {
  const userSession = await auth();

  if (!userSession) {
    console.log("Unauthorized");
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  if (!resourceId) {
    console.log("Resource ID is required");
    return {
      success: false,
      message: "Resource ID is required",
    };
  }

  if (!name) {
    console.log("Name is required");
    return {
      success: false,
      message: "Name is required",
    };
  }

  if (!description) {
    console.log("Description is required");
    return {
      success: false,
      message: "Description is required",
    };
  }

  if (!categoryId) {
    console.log("Category ID is required");
    return {
      success: false,
      message: "Category ID is required",
    };
  }

  try {
    await db
      .update(resources)
      .set({
        name,
        description,
        categoryId,
      })
      .where(eq(resources.id, resourceId));

    console.log("successfully edit resource");

    revalidatePath(`/admin/companies/${companyId}`);
    revalidatePath(`/admin/companies/${companyId}/resources/${resourceId}`);

    return {
      success: true,
      message: "Resource updated successfully",
    };
  } catch (error) {
    console.log("An error occured trying to edit resource", error);
    return {
      success: false,
      message: "An error occured trying to edit resource",
    };
  }
}
