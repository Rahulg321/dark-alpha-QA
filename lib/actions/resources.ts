"use server";

import {
  insertResourceSchema,
  resources,
  embeddings as embeddingsTable,
} from "@/lib/db/schema";
import { db } from "@/lib/db/queries";
import { generateEmbeddings } from "../ai/embedding";

export const createResource = async (input: { content: string }) => {
  try {
    const { content } = insertResourceSchema.parse(input);

    return "Resource successfully created and embedded.";
  } catch (e) {
    console.error("An Error Occured while creating a resource", e);
    if (e instanceof Error)
      return e.message.length > 0 ? e.message : "Error, please try again.";
  }
};
