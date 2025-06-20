import { embeddings as embeddingsTable } from "../db/schema";
import { db } from "../db/queries";
import { inArray } from "drizzle-orm";
import { generateEmbedding } from "./embedding";
import { cosineSimilarity } from "../utils";

export interface ComparisonResult {
  resourceId: string;
  name: string;
  content: string;
  similarity: number;
}

export default async function compareResourcesInfomation(
  userQuery: string,
  resources: { id: string; name: string }[]
) {
  console.log(
    "Comparing user query against specific resource",
    resources.map((r) => r.name)
  );

  const userQueryEmbedding = await generateEmbedding(userQuery);
  const resourceIds = resources.map((r) => r.id);
  console.log("resourceIds", resourceIds);

  let rows: any[] = [];

  try {
    rows = await db
      .select({
        resourceId: embeddingsTable.resourceId,
        content: embeddingsTable.content,
        embedding: embeddingsTable.embedding,
      })
      .from(embeddingsTable)
      .where(inArray(embeddingsTable.resourceId, resourceIds));
  } catch (error) {
    console.log("error fetching rows", error);
    return [];
  }

  console.log("rows were fetched", rows.length);

  const results: ComparisonResult[] = rows.map((row) => {
    const similarity = cosineSimilarity(row.embedding, userQueryEmbedding);
    const meta = resources.find((r) => r.id === row.resourceId)!;

    return {
      resourceId: row.resourceId,
      name: meta.name,
      content: row.content,
      similarity,
    };
  });

  console.log("results", results);

  // Filter and sort
  const filtered = results
    .filter((r) => r.similarity > 0.4)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, resources.length);

  console.log("Comparison results:", filtered);
  return filtered;
}
