"use server";

import {
  resourceCategorySchema,
  type ResourceCategorySchema,
} from "../schemas/resource-category-schema";
import { resourceCategories } from "../db/schema";

import { db } from "../db/queries";
import { auth } from "@/app/(auth)/auth";
import { revalidatePath } from "next/cache";

/**
 * Add a new resource category
 * @param values - The values to add
 * @returns The new resource category
 */
export async function addResourceCategory(values: ResourceCategorySchema) {
  const userSession = await auth();
  if (!userSession) {
    return { success: false, message: "Unauthorized" };
  }

  const validatedData = resourceCategorySchema.safeParse(values);
  if (!validatedData.success) {
    return { success: false, message: "Invalid data" };
  }

  try {
    const [insertedResourceCategory] = await db
      .insert(resourceCategories)
      .values({
        name: validatedData.data.name,
        description: validatedData.data.description,
      })
      .returning();

    revalidatePath("/admin/categories");

    return {
      success: true,
      message: "Resource category added successfully",
      resourceCategory: insertedResourceCategory,
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to add resource category" };
  }
}
