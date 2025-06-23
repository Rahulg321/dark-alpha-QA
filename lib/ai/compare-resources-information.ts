import {
  embeddings as embeddingsTable,
  resources as resourcesTable,
} from "../db/schema";
import { db } from "../db/queries";
import { inArray, eq, desc } from "drizzle-orm";
import { generateEmbedding } from "./embedding";
import { cosineSimilarity } from "../utils";

export interface ComparisonResult {
  resourceId: string;
  name: string;
  content: string;
  similarity: number;
  isComplete: boolean;
}

export default async function compareResourcesInfomation(
  userQuery: string,
  resources: { id: string; name: string }[]
) {
  if (!resources || resources.length === 0) {
    return [];
  }

  // Check if user is asking for complete/comprehensive information
  const isCompleteRequest = isComprehensiveRequest(userQuery);
  console.log("Is complete request:", isCompleteRequest);

  try {
    const resourceIds = resources.map((r) => r.id);
    console.log("Resource IDs to search:", resourceIds);

    const embeddingRows = await db
      .select({
        resourceId: embeddingsTable.resourceId,
        content: embeddingsTable.content,
        embedding: embeddingsTable.embedding,
      })
      .from(embeddingsTable)
      .where(inArray(embeddingsTable.resourceId, resourceIds))
      .orderBy(embeddingsTable.resourceId, desc(embeddingsTable.id));

    if (embeddingRows.length === 0) {
      return [];
    }

    const embeddingsByResource = groupEmbeddingsByResource(embeddingRows);

    let results: ComparisonResult[] = [];

    if (isCompleteRequest) {
      results = await processCompleteRequest(embeddingsByResource, resources);
    } else {
      results = await processSimilarityRequest(
        userQuery,
        embeddingsByResource,
        resources
      );
    }

    // Final safety check: ensure we have results for all requested resources
    results = ensureAllResourcesCovered(
      results,
      resources,
      embeddingsByResource
    );

    console.log("Final results count:", results.length);
    console.log(
      "Results summary:",
      results.map((r) => ({
        name: r.name,
        contentLength: r.content.length,
        similarity: r.similarity?.toFixed(4) || "N/A",
        isComplete: r.isComplete,
      }))
    );

    return results;
  } catch (error) {
    console.error("Error in compareResourcesInfomation:", error);
    return [];
  }
}

function isComprehensiveRequest(query: string): boolean {
  const comprehensiveKeywords = [
    "complete",
    "comprehensive",
    "full",
    "all",
    "everything",
    "entire",
    "whole",
    "total",
    "complete information",
    "all information",
    "everything about",
    "full details",
    "complete details",
    "summarize",
    "overview",
    "summary",
    "describe",
    "explain",
    "what is",
    "tell me about",
    "show me",
    "give me",
    "provide",
    "list",
    "enumerate",
    "detail",
    "comprehensive overview",
  ];

  const lowerQuery = query.toLowerCase();
  return comprehensiveKeywords.some((keyword) => lowerQuery.includes(keyword));
}

function groupEmbeddingsByResource(embeddingRows: any[]) {
  const grouped: Record<string, any[]> = {};

  for (const row of embeddingRows) {
    if (!grouped[row.resourceId]) {
      grouped[row.resourceId] = [];
    }
    grouped[row.resourceId].push(row);
  }

  return grouped;
}

async function processCompleteRequest(
  embeddingsByResource: Record<string, any[]>,
  resources: { id: string; name: string }[]
): Promise<ComparisonResult[]> {
  const results: ComparisonResult[] = [];

  for (const [resourceId, embeddings] of Object.entries(embeddingsByResource)) {
    const resourceMeta = resources.find((r) => r.id === resourceId);
    if (!resourceMeta) {
      console.warn(`No resource metadata found for resourceId: ${resourceId}`);
      continue;
    }

    // Combine all content chunks for this resource
    const combinedContent = embeddings
      .map((row) => row.content)
      .join("\n\n---\n\n");

    console.log(
      `Resource: ${resourceMeta.name}, Total chunks: ${embeddings.length}, Combined content length: ${combinedContent.length}`
    );

    results.push({
      resourceId,
      name: resourceMeta.name,
      content: combinedContent,
      similarity: 1.0, // Perfect similarity for complete requests
      isComplete: true,
    });
  }

  return results;
}

async function processSimilarityRequest(
  userQuery: string,
  embeddingsByResource: Record<string, any[]>,
  resources: { id: string; name: string }[]
): Promise<ComparisonResult[]> {
  const results: ComparisonResult[] = [];

  // Generate embedding for user query
  console.log("Generating embedding for user query...");
  const userQueryEmbedding = await generateEmbedding(userQuery);
  console.log("User query embedding length:", userQueryEmbedding.length);

  for (const [resourceId, embeddings] of Object.entries(embeddingsByResource)) {
    const resourceMeta = resources.find((r) => r.id === resourceId);
    if (!resourceMeta) {
      console.warn(`No resource metadata found for resourceId: ${resourceId}`);
      continue;
    }

    // Calculate similarity for each chunk
    const chunkResults = embeddings.map((row) => {
      const similarity = cosineSimilarity(row.embedding, userQueryEmbedding);
      return {
        content: row.content,
        similarity,
      };
    });

    // Sort chunks by similarity
    chunkResults.sort((a, b) => b.similarity - a.similarity);

    // For single resource, include more chunks; for multiple resources, be more selective
    const maxChunks = resources.length === 1 ? 15 : 8; // Increased chunk limits
    const minSimilarityThreshold = resources.length === 1 ? 0.2 : 0.3; // Lower threshold for single resource

    let relevantChunks = chunkResults
      .filter((chunk) => chunk.similarity > minSimilarityThreshold)
      .slice(0, maxChunks);

    // Fallback: if no chunks meet threshold, include top chunks anyway
    if (relevantChunks.length === 0) {
      console.log(
        `No chunks met similarity threshold for ${
          resourceMeta.name
        }, including top ${Math.min(3, chunkResults.length)} chunks`
      );
      relevantChunks = chunkResults.slice(0, Math.min(3, chunkResults.length));
    }

    // Additional fallback: if still no chunks, include all chunks
    if (relevantChunks.length === 0 && chunkResults.length > 0) {
      console.log(`Including all chunks for ${resourceMeta.name} as fallback`);
      relevantChunks = chunkResults;
    }

    const combinedContent = relevantChunks
      .map((chunk) => chunk.content)
      .join("\n\n---\n\n");

    const avgSimilarity =
      relevantChunks.length > 0
        ? relevantChunks.reduce((sum, chunk) => sum + chunk.similarity, 0) /
          relevantChunks.length
        : 0;

    console.log(
      `Resource: ${resourceMeta.name}, Relevant chunks: ${
        relevantChunks.length
      }, Avg similarity: ${avgSimilarity.toFixed(4)}`
    );

    results.push({
      resourceId,
      name: resourceMeta.name,
      content: combinedContent,
      similarity: avgSimilarity,
      isComplete: false,
    });
  }

  // Sort results by average similarity
  results.sort((a, b) => b.similarity - a.similarity);

  return results;
}

/**
 * This function ensures that all requested resources are covered in the results.
 * If a resource is missing, it will be added to the results with all its content.
 * @param results - The results of the comparison.
 * @param requestedResources - The resources that were requested.
 * @param embeddingsByResource - The embeddings by resource.
 * @returns The results with all requested resources covered.
 */
function ensureAllResourcesCovered(
  results: ComparisonResult[],
  requestedResources: { id: string; name: string }[],
  embeddingsByResource: Record<string, any[]>
): ComparisonResult[] {
  const coveredResourceIds = new Set(results.map((r) => r.resourceId));

  const missingResources = requestedResources.filter(
    (r) => !coveredResourceIds.has(r.id)
  );

  if (missingResources.length === 0) {
    return results;
  }

  // Add missing resources with all their content
  for (const missingResource of missingResources) {
    const embeddings = embeddingsByResource[missingResource.id];
    if (embeddings && embeddings.length > 0) {
      const combinedContent = embeddings
        .map((row) => row.content)
        .join("\n\n---\n\n");

      results.push({
        resourceId: missingResource.id,
        name: missingResource.name,
        content: combinedContent,
        similarity: 0.5,
        isComplete: true,
      });
    }
  }

  return results;
}
