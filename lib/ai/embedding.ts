import { embed, embedMany } from "ai";
import { openai } from "@ai-sdk/openai";
import { embeddings } from "../db/schema";
import { cosineDistance, desc, gt, sql } from "drizzle-orm";
import { db } from "@/lib/db/queries";
import { embeddings as embeddingsTable } from "@/lib/db/schema";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { encoding_for_model } from "tiktoken";

const embeddingModel = openai.embedding("text-embedding-ada-002");

export async function generateChunksFromText(text: string) {
  const encoder = encoding_for_model("text-embedding-3-small");

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000, // Maximum tokens per chunk
    chunkOverlap: 200, // 20% overlap to preserve context
    separators: ["\n\n", "\n", " ", ""], // Logical split points
    lengthFunction: (text) => {
      const tokens = encoder.encode(text);
      return tokens.length;
    },
  });

  // Split the text into chunks
  const chunks = await textSplitter.createDocuments([text]);

  encoder.free();

  console.log("Chunks generated:", chunks);

  return { chunks };
}

export function chunkTokens(tokens: number[], chunkSize = 800, overlap = 100) {
  const chunks: number[][] = [];
  for (let start = 0; start < tokens.length; start += chunkSize - overlap) {
    const slice = tokens.slice(start, start + chunkSize);
    chunks.push(slice);
  }
  return chunks;
}

const generateChunks = (input: string): string[] => {
  return input
    .trim()
    .split(".")
    .filter((i) => i !== "");
};

export const generateEmbeddings = async (
  value: string
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

export const generateEmbeddingsFromChunks = async (
  chunks: string[]
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const encoder = encoding_for_model("text-embedding-3-small");
  const maxTokens = 300000;
  const batches: string[][] = [];
  let currentBatch: string[] = [];
  let currentTokenCount = 0;

  for (const chunk of chunks) {
    const tokens = encoder.encode(chunk);
    if (
      currentTokenCount + tokens.length > maxTokens &&
      currentBatch.length > 0
    ) {
      batches.push(currentBatch);
      currentBatch = [];
      currentTokenCount = 0;
    }
    currentBatch.push(chunk);
    currentTokenCount += tokens.length;
  }
  if (currentBatch.length > 0) {
    batches.push(currentBatch);
  }

  let allEmbeddings: Array<{ embedding: number[]; content: string }> = [];
  for (const batch of batches) {
    const { embeddings } = await embedMany({
      model: embeddingModel,
      values: batch,
    });
    allEmbeddings = allEmbeddings.concat(
      embeddings.map((e, i) => ({ content: batch[i], embedding: e }))
    );
  }
  encoder.free();
  return allEmbeddings;
};

export const generateEmbedding = async (value: string): Promise<number[]> => {
  console.log("Generating embedding for value:", value);
  const input = value.replaceAll("\\n", " ");
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
    userQueryEmbedded
  )})`;
  const similarGuides = await db
    .select({ name: embeddingsTable.content, similarity })
    .from(embeddingsTable)
    .where(gt(similarity, 0.5))
    .orderBy((t) => desc(t.similarity))
    .limit(4);
  console.log("Similar guides found:", similarGuides);
  return similarGuides;
};

// export const findRelevantContent = async (userQuery: string) => {
//   // 1. Generate user embedding
//   const userEmbedding = await generateEmbedding(userQuery);

//   // 2. Query using pgvector operator and index
//   const similarGuides = await db
//     .select({
//       content: embeddingsTable.content,
//       similarity: sql<number>`
//         1 - ( ${embeddingsTable.embedding} <=> ${userEmbedding} )
//       `,
//     })
//     .from(embeddingsTable)
//     .orderBy(sql`${embeddingsTable.embedding} <=> ${userEmbedding}`)
//     .limit(4);

//   console.log("Similar guides found:", similarGuides);

//   return similarGuides;
// };

// Helper function to chunk sentences by word count
export function chunkSentencesByWords(
  sentences: string[],
  maxWords: number,
  overlap: number
): string[] {
  const chunks: string[] = [];
  let currentChunk: string[] = [];
  let currentWordCount = 0;
  let i = 0;

  while (i < sentences.length) {
    const sentence = sentences[i];
    const wordCount = sentence.split(/\s+/).length;
    if (currentWordCount + wordCount > maxWords && currentChunk.length > 0) {
      chunks.push(currentChunk.join(" "));
      // Overlap: go back by enough sentences to cover the overlap
      let overlapWords = 0;
      let j = currentChunk.length - 1;
      while (j >= 0 && overlapWords < overlap) {
        overlapWords += currentChunk[j].split(/\s+/).length;
        j--;
      }
      currentChunk = currentChunk.slice(j + 1);
      currentWordCount = currentChunk.reduce(
        (sum, s) => sum + s.split(/\s+/).length,
        0
      );
    }
    currentChunk.push(sentence);
    currentWordCount += wordCount;
    i++;
  }
  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(" "));
  }
  return chunks;
}
