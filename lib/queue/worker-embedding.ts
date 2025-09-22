import { embed, embedMany } from "ai";
import { openai } from "@ai-sdk/openai";
import { embeddings, resources } from "../db/schema";
import { cosineDistance, desc, gt, sql } from "drizzle-orm";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { encoding_for_model } from "tiktoken";

const embeddingModel = openai.embedding("text-embedding-ada-002");

/**
 * This function is used to split the sheets into chunks of text based on the maxRowsPerChunk
 * It will return an array of objects with the sheet name and the text of the chunk
 *
 * @param sheets - The sheets to split into chunks
 * @param maxRowsPerChunk - The maximum number of rows per chunk
 * @returns An array of objects with the sheet name and the text of the chunk
 */
export function rowsToTextChunks(
  sheets: Record<string, any[][]>,
  maxRowsPerChunk: number = 50
): Array<{ sheet: string; text: string }> {
  const chunks: Array<{ sheet: string; text: string }> = [];

  for (const [sheetName, rows] of Object.entries(sheets)) {
    // Skip empty sheets
    if (!rows || rows.length === 0) continue;

    // Process rows in chunks
    for (let i = 0; i < rows.length; i += maxRowsPerChunk) {
      const chunkRows = rows.slice(i, i + maxRowsPerChunk);

      // Convert rows to text
      const chunkText = chunkRows
        .map(row =>
          row
            .map(cell => cell?.toString() || '')
            .filter(cell => cell.trim() !== '')
            .join(' | ')
        )
        .filter(rowText => rowText.trim() !== '')
        .join('\n');

      if (chunkText.trim()) {
        chunks.push({
          sheet: sheetName,
          text: chunkText
        });
      }
    }
  }

  return chunks;
}

export async function generateChunksFromText(text: string) {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const chunks = await textSplitter.createDocuments([text]);

  return { chunks };
}

export async function generateEmbeddingsFromChunks(textChunks: string[]) {
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: textChunks,
  });

  return embeddings.map((embedding, index) => ({
    content: textChunks[index],
    embedding: embedding,
  }));
}