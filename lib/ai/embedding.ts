import { embed, embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';
import { embeddings } from '../db/schema';
import { cosineDistance, desc, gt, sql } from 'drizzle-orm';
import { db } from '@/lib/db/queries';
import { embeddings as embeddingsTable } from '@/lib/db/schema';

const embeddingModel = openai.embedding('text-embedding-ada-002');

const generateChunks = (input: string): string[] => {
    return input
      .trim()
      .split('.')
      .filter(i => i !== '');
  };


  export const generateEmbeddings = async (
    value: string,
  ): Promise<Array<{ embedding: number[]; content: string }>> => {
    console.log("Generating embeddings for value:", value);
    const chunks = generateChunks(value);
    console.log("Chunks generated:", chunks);
    const { embeddings } = await embedMany({
      model: embeddingModel,
      values: chunks,
    });
    return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
  };

  export const generateEmbedding = async (value: string): Promise<number[]> => {
    console.log("Generating embedding for value:", value);
    const input = value.replaceAll('\\n', ' ');
    const { embedding } = await embed({
      model: embeddingModel,
      value: input,
    });
    return embedding;
  };

  export const findRelevantContent = async (userQuery: string) => {
    console.log("Finding relevant content for user query:", userQuery);
    const userQueryEmbedded = await generateEmbedding(userQuery);
    const similarity = sql<number>`1 - (${cosineDistance(
      embeddings.embedding,
      userQueryEmbedded,
    )})`;
    const similarGuides = await db
      .select({ name: embeddingsTable.content, similarity })
      .from(embeddingsTable)
      .where(gt(similarity, 0.5))
      .orderBy(t => desc(t.similarity))
      .limit(4);
    return similarGuides;
  };