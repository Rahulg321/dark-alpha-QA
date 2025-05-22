'use server';

import {
  insertResourceSchema,
  resources,
  embeddings as embeddingsTable
} from '@/lib/db/schema';
import { db } from '@/lib/db/queries';
import { generateEmbeddings } from '../ai/embedding';


export const createResource = async (input: {
    content: string;
}) => {
  try {
    const { content } = insertResourceSchema.parse(input);

    if (!content) {
      throw new Error('Content is required');
    }

    const [resource] = await db
      .insert(resources)
      .values({ content })
      .returning();

      console.log("Resource created", resource);

      const embeddings = await generateEmbeddings(content);
      console.log("Embeddings generated");
      await db.insert(embeddingsTable).values(
        embeddings.map(embedding => ({
          resourceId: resource.id,
          ...embedding,
        })),
      );
  
      return 'Resource successfully created and embedded.';

  } catch (e) {
    console.error("An Error Occured while creating a resource", e);
    if (e instanceof Error)
      return e.message.length > 0 ? e.message : 'Error, please try again.';
  }
};