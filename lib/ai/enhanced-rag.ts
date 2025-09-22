import { generateEmbedding } from "./embedding";
import { db } from "../db/queries";
import {
  embeddings as embeddingsTable,
  resources as resourcesTable,
  company as companiesTable,
  ticket as ticketsTable,
  companyQuestions,
  answers,
  comparisonQuestions,
  chat,
  message,
  document,
} from "../db/schema";
import { cosineDistance, desc, gt, sql, like, or, eq, ilike } from "drizzle-orm";
import { cosineSimilarity } from "../utils";

export interface EnhancedSearchResult {
  type: 'embedding' | 'company' | 'ticket' | 'qa' | 'chat' | 'document';
  id: string;
  title: string;
  content: string;
  similarity?: number;
  metadata?: Record<string, any>;
  resourceId?: string;
  companyId?: string;
}

export interface EnhancedRAGResponse {
  searchResults: EnhancedSearchResult[];
  contextSummary: {
    totalSources: number;
    sourcesBreakdown: Record<string, number>;
    highestSimilarity: number;
    averageSimilarity: number;
  };
  rawContext: string;
}

/**
 * Enhanced RAG system that searches across the entire database
 * including embeddings, companies, tickets, Q&As, chats, and documents
 */
export async function enhancedRAGSearch(
  query: string,
  options: {
    includeEmbeddings?: boolean;
    includeCompanies?: boolean;
    includeTickets?: boolean;
    includeQAs?: boolean;
    includeChats?: boolean;
    includeDocs?: boolean;
    maxResults?: number;
    similarityThreshold?: number;
    companyId?: string; // Filter by specific company
    userId?: string; // Filter by user context
  } = {}
): Promise<EnhancedRAGResponse> {
  const {
    includeEmbeddings = true,
    includeCompanies = true,
    includeTickets = true,
    includeQAs = true,
    includeChats = true,
    includeDocs = true,
    maxResults = 20,
    similarityThreshold = 0.3,
    companyId,
    userId,
  } = options;

  console.log("Enhanced RAG search for query:", query);
  console.log("Search options:", options);

  const allResults: EnhancedSearchResult[] = [];
  let queryEmbedding: number[] | null = null;

  // Generate embedding for similarity search
  if (includeEmbeddings) {
    try {
      queryEmbedding = await generateEmbedding(query);
      console.log("Generated query embedding with dimensions:", queryEmbedding.length);
    } catch (error) {
      console.error("Failed to generate query embedding:", error);
    }
  }

  // 1. Search vector embeddings (semantic similarity)
  if (includeEmbeddings && queryEmbedding) {
    try {
      const similarity = sql<number>`1 - (${cosineDistance(
        embeddingsTable.embedding,
        queryEmbedding
      )})`;

      let embeddingQuery = db
        .select({
          id: embeddingsTable.id,
          resourceId: embeddingsTable.resourceId,
          content: embeddingsTable.content,
          similarity,
          resourceName: resourcesTable.name,
          resourceDescription: resourcesTable.description,
          companyId: resourcesTable.companyId,
          companyName: companiesTable.name,
        })
        .from(embeddingsTable)
        .leftJoin(resourcesTable, eq(embeddingsTable.resourceId, resourcesTable.id))
        .leftJoin(companiesTable, eq(resourcesTable.companyId, companiesTable.id))
        .where(gt(similarity, similarityThreshold))
        .orderBy(desc(similarity))
        .limit(Math.floor(maxResults * 0.6)); // Allocate 60% to embeddings

      // Apply company filter if specified
      if (companyId) {
        embeddingQuery = embeddingQuery.where(eq(resourcesTable.companyId, companyId));
      }

      const embeddingResults = await embeddingQuery;

      for (const result of embeddingResults) {
        allResults.push({
          type: 'embedding',
          id: result.id,
          title: result.resourceName || 'Unknown Resource',
          content: result.content,
          similarity: result.similarity,
          metadata: {
            resourceDescription: result.resourceDescription,
            companyName: result.companyName,
          },
          resourceId: result.resourceId,
          companyId: result.companyId,
        });
      }

      console.log(`Found ${embeddingResults.length} embedding results`);
    } catch (error) {
      console.error("Error searching embeddings:", error);
    }
  }

  // 2. Search companies (keyword matching)
  if (includeCompanies) {
    try {
      let companyQuery = db
        .select({
          id: companiesTable.id,
          name: companiesTable.name,
          description: companiesTable.description,
          type: companiesTable.type,
          industry: companiesTable.industry,
          website: companiesTable.website,
          email: companiesTable.email,
        })
        .from(companiesTable)
        .where(
          or(
            ilike(companiesTable.name, `%${query}%`),
            ilike(companiesTable.description, `%${query}%`),
            ilike(companiesTable.type, `%${query}%`),
            ilike(companiesTable.industry, `%${query}%`)
          )
        )
        .limit(5);

      if (companyId) {
        companyQuery = companyQuery.where(eq(companiesTable.id, companyId));
      }

      const companyResults = await companyQuery;

      for (const company of companyResults) {
        allResults.push({
          type: 'company',
          id: company.id,
          title: company.name,
          content: `Company: ${company.name}\nType: ${company.type}\nIndustry: ${company.industry}\nDescription: ${company.description || 'N/A'}\nWebsite: ${company.website || 'N/A'}\nEmail: ${company.email || 'N/A'}`,
          metadata: {
            type: company.type,
            industry: company.industry,
            website: company.website,
            email: company.email,
          },
          companyId: company.id,
        });
      }

      console.log(`Found ${companyResults.length} company results`);
    } catch (error) {
      console.error("Error searching companies:", error);
    }
  }

  // 3. Search tickets (keyword matching)
  if (includeTickets) {
    try {
      let ticketQuery = db
        .select({
          id: ticketsTable.id,
          title: ticketsTable.title,
          description: ticketsTable.description,
          status: ticketsTable.status,
          priority: ticketsTable.priority,
          type: ticketsTable.type,
          fromName: ticketsTable.fromName,
          fromEmail: ticketsTable.fromEmail,
          tags: ticketsTable.tags,
          createdAt: ticketsTable.createdAt,
        })
        .from(ticketsTable)
        .where(
          or(
            ilike(ticketsTable.title, `%${query}%`),
            ilike(ticketsTable.description, `%${query}%`),
            ilike(ticketsTable.fromName, `%${query}%`),
            ilike(ticketsTable.fromEmail, `%${query}%`)
          )
        )
        .orderBy(desc(ticketsTable.createdAt))
        .limit(5);

      if (userId) {
        ticketQuery = ticketQuery.where(eq(ticketsTable.userId, userId));
      }

      const ticketResults = await ticketQuery;

      for (const ticket of ticketResults) {
        allResults.push({
          type: 'ticket',
          id: ticket.id,
          title: ticket.title,
          content: `Ticket: ${ticket.title}\nStatus: ${ticket.status}\nPriority: ${ticket.priority}\nType: ${ticket.type}\nFrom: ${ticket.fromName} (${ticket.fromEmail})\nDescription: ${ticket.description || 'N/A'}\nTags: ${ticket.tags?.join(', ') || 'None'}`,
          metadata: {
            status: ticket.status,
            priority: ticket.priority,
            type: ticket.type,
            fromName: ticket.fromName,
            fromEmail: ticket.fromEmail,
            tags: ticket.tags,
            createdAt: ticket.createdAt,
          },
        });
      }

      console.log(`Found ${ticketResults.length} ticket results`);
    } catch (error) {
      console.error("Error searching tickets:", error);
    }
  }

  // 4. Search Q&As (company questions and answers)
  if (includeQAs) {
    try {
      let qaQuery = db
        .select({
          questionId: companyQuestions.id,
          title: companyQuestions.title,
          answer: answers.answer,
          answerType: answers.type,
          companyId: companyQuestions.companyId,
          companyName: companiesTable.name,
        })
        .from(companyQuestions)
        .leftJoin(answers, eq(companyQuestions.id, answers.companyQuestionId))
        .leftJoin(companiesTable, eq(companyQuestions.companyId, companiesTable.id))
        .where(
          or(
            ilike(companyQuestions.title, `%${query}%`),
            ilike(answers.answer, `%${query}%`)
          )
        )
        .limit(5);

      if (companyId) {
        qaQuery = qaQuery.where(eq(companyQuestions.companyId, companyId));
      }

      const qaResults = await qaQuery;

      for (const qa of qaResults) {
        if (qa.answer) {
          allResults.push({
            type: 'qa',
            id: qa.questionId,
            title: qa.title,
            content: `Q&A for ${qa.companyName}:\nQuestion: ${qa.title}\nAnswer: ${qa.answer}\nAnswer Type: ${qa.answerType}`,
            metadata: {
              companyName: qa.companyName,
              answerType: qa.answerType,
            },
            companyId: qa.companyId,
          });
        }
      }

      console.log(`Found ${qaResults.length} Q&A results`);
    } catch (error) {
      console.error("Error searching Q&As:", error);
    }
  }

  // 5. Search chats (keyword matching in chat titles and message content)
  if (includeChats && userId) {
    try {
      const chatQuery = db
        .select({
          chatId: chat.id,
          title: chat.title,
          content: message.parts,
          role: message.role,
          createdAt: chat.createdAt,
        })
        .from(chat)
        .leftJoin(message, eq(chat.id, message.chatId))
        .where(
          or(
            ilike(chat.title, `%${query}%`),
            sql`${message.parts}::text ILIKE ${`%${query}%`}`
          )
        )
        .orderBy(desc(chat.createdAt))
        .limit(5);

      const chatResults = await chatQuery;

      const groupedChats = new Map<string, any>();
      
      for (const chatResult of chatResults) {
        if (!groupedChats.has(chatResult.chatId)) {
          groupedChats.set(chatResult.chatId, {
            id: chatResult.chatId,
            title: chatResult.title,
            messages: [],
            createdAt: chatResult.createdAt,
          });
        }
        
        if (chatResult.content) {
          groupedChats.get(chatResult.chatId).messages.push({
            role: chatResult.role,
            content: chatResult.content,
          });
        }
      }

      for (const [, chatData] of groupedChats) {
        const messageContent = chatData.messages
          .map((msg: any) => `${msg.role}: ${JSON.stringify(msg.content)}`)
          .join('\n');

        allResults.push({
          type: 'chat',
          id: chatData.id,
          title: chatData.title,
          content: `Chat: ${chatData.title}\nMessages:\n${messageContent}`,
          metadata: {
            messageCount: chatData.messages.length,
            createdAt: chatData.createdAt,
          },
        });
      }

      console.log(`Found ${groupedChats.size} chat results`);
    } catch (error) {
      console.error("Error searching chats:", error);
    }
  }

  // 6. Search documents (keyword matching)
  if (includeDocs && userId) {
    try {
      const docQuery = db
        .select({
          id: document.id,
          title: document.title,
          content: document.content,
          kind: document.kind,
          createdAt: document.createdAt,
        })
        .from(document)
        .where(
          or(
            ilike(document.title, `%${query}%`),
            ilike(document.content, `%${query}%`)
          )
        )
        .orderBy(desc(document.createdAt))
        .limit(5);

      const docResults = await docQuery;

      for (const doc of docResults) {
        allResults.push({
          type: 'document',
          id: doc.id,
          title: doc.title,
          content: `Document: ${doc.title}\nType: ${doc.kind}\nContent: ${doc.content || 'N/A'}`,
          metadata: {
            kind: doc.kind,
            createdAt: doc.createdAt,
          },
        });
      }

      console.log(`Found ${docResults.length} document results`);
    } catch (error) {
      console.error("Error searching documents:", error);
    }
  }

  // Sort results by similarity (embeddings first, then by relevance)
  allResults.sort((a, b) => {
    if (a.similarity && b.similarity) {
      return b.similarity - a.similarity;
    }
    if (a.similarity && !b.similarity) return -1;
    if (!a.similarity && b.similarity) return 1;
    return 0;
  });

  // Limit final results
  const limitedResults = allResults.slice(0, maxResults);

  // Calculate context summary
  const sourcesBreakdown = limitedResults.reduce((acc, result) => {
    acc[result.type] = (acc[result.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const similarities = limitedResults
    .map(r => r.similarity)
    .filter((s): s is number => s !== undefined);

  const contextSummary = {
    totalSources: limitedResults.length,
    sourcesBreakdown,
    highestSimilarity: similarities.length > 0 ? Math.max(...similarities) : 0,
    averageSimilarity: similarities.length > 0 
      ? similarities.reduce((a, b) => a + b, 0) / similarities.length 
      : 0,
  };

  // Create raw context string
  const rawContext = limitedResults
    .map((result, index) => {
      const prefix = `[${index + 1}] ${result.type.toUpperCase()}: ${result.title}`;
      const similarity = result.similarity 
        ? ` (similarity: ${result.similarity.toFixed(3)})` 
        : '';
      return `${prefix}${similarity}\n${result.content}\n---`;
    })
    .join('\n\n');

  console.log("Enhanced RAG search completed:", {
    totalResults: limitedResults.length,
    sourcesBreakdown,
    averageSimilarity: contextSummary.averageSimilarity.toFixed(3),
  });

  return {
    searchResults: limitedResults,
    contextSummary,
    rawContext,
  };
}

/**
 * Quick helper function for chat interface - searches with sensible defaults
 */
export async function chatRAGSearch(
  query: string,
  userId?: string,
  companyId?: string
): Promise<string> {
  const result = await enhancedRAGSearch(query, {
    maxResults: 15,
    similarityThreshold: 0.25,
    userId,
    companyId,
  });

  if (result.searchResults.length === 0) {
    return "No relevant information found in the database for your query.";
  }

  return result.rawContext;
}

/**
 * Focused search for specific resource comparison (maintains backward compatibility)
 */
export async function resourceFocusedRAG(
  query: string,
  resourceIds: string[]
): Promise<EnhancedRAGResponse> {
  const queryEmbedding = await generateEmbedding(query);
  
  const similarity = sql<number>`1 - (${cosineDistance(
    embeddingsTable.embedding,
    queryEmbedding
  )})`;

  const results = await db
    .select({
      id: embeddingsTable.id,
      resourceId: embeddingsTable.resourceId,
      content: embeddingsTable.content,
      similarity,
      resourceName: resourcesTable.name,
      companyId: resourcesTable.companyId,
    })
    .from(embeddingsTable)
    .leftJoin(resourcesTable, eq(embeddingsTable.resourceId, resourcesTable.id))
    .where(
      sql`${embeddingsTable.resourceId} = ANY(${resourceIds}) AND ${similarity} > 0.3`
    )
    .orderBy(desc(similarity))
    .limit(20);

  const searchResults: EnhancedSearchResult[] = results.map(result => ({
    type: 'embedding',
    id: result.id,
    title: result.resourceName || 'Unknown Resource',
    content: result.content,
    similarity: result.similarity,
    resourceId: result.resourceId,
    companyId: result.companyId,
  }));

  const similarities = searchResults.map(r => r.similarity!);
  
  return {
    searchResults,
    contextSummary: {
      totalSources: searchResults.length,
      sourcesBreakdown: { embedding: searchResults.length },
      highestSimilarity: Math.max(...similarities),
      averageSimilarity: similarities.reduce((a, b) => a + b, 0) / similarities.length,
    },
    rawContext: searchResults
      .map((result, index) => 
        `[${index + 1}] ${result.title} (similarity: ${result.similarity?.toFixed(3)})\n${result.content}\n---`
      )
      .join('\n\n'),
  };
}