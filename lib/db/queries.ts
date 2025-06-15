import "server-only";

import {
  and,
  asc,
  count,
  desc,
  eq,
  gt,
  gte,
  inArray,
  ilike,
  lt,
  type SQL,
} from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import {
  user,
  chat,
  type User,
  document,
  type Suggestion,
  suggestion,
  message,
  vote,
  type DBMessage,
  type Chat,
  stream,
  ticket,
  company,
  resources,
  companyQuestions,
  answers,
  resourceCategories,
} from "./schema";
import type { ArtifactKind } from "@/components/artifact";
import { generateUUID } from "../utils";
import { generateHashedPassword } from "./utils";
import type { VisibilityType } from "@/components/visibility-selector";
import { ChatSDKError } from "../errors";
import { ResourcesWithoutContent } from "../types";

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle

// biome-ignore lint: Forbidden non-null assertion.
const client = postgres(process.env.POSTGRES_URL!);
export const db = drizzle(client);

export async function getUser(email: string): Promise<Array<User>> {
  try {
    return await db.select().from(user).where(eq(user.email, email));
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get user by email"
    );
  }
}

/**
 * Get a user by email
 * @param email - The email of the user
 * @returns The user
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const [foundUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, email));
    return foundUser;
  } catch (error) {
    console.log("An error occured trying to get user by email", error);
    return null;
  }
}

/**
 * Get a resource by id
 * @param resourceId - The id of the resource
 * @returns The resource with optional category information
 */
export async function getResourceWithCategoryById(resourceId: string) {
  try {
    const [result] = await db
      .select({
        id: resources.id,
        name: resources.name,
        description: resources.description,
        kind: resources.kind,
        tags: resources.tags,
        createdAt: resources.createdAt,
        categoryId: resources.categoryId,
        categoryName: resourceCategories.name,
      })
      .from(resources)
      .leftJoin(
        resourceCategories,
        eq(resources.categoryId, resourceCategories.id)
      )
      .where(eq(resources.id, resourceId));

    return {
      ...result,
      categoryName: result.categoryName ?? null,
    };
  } catch (error) {
    console.log("An error occured trying to get resource by id", error);
    return null;
  }
}

/**
 * Get a resource by id
 * @param resourceId - The id of the resource
 * @returns The resource
 */
export async function getResourceById(resourceId: string) {
  try {
    const [resource] = await db
      .select()
      .from(resources)
      .where(eq(resources.id, resourceId));
    return resource;
  } catch (error) {
    console.log("An error occured trying to get resource by id", error);
    return null;
  }
}

/**
 * Get company question by id
 * @param id - The id of the company question
 * @returns The company question
 */
export async function getCompanyQuestionById(id: string) {
  try {
    const [question] = await db
      .select()
      .from(companyQuestions)
      .where(eq(companyQuestions.id, id));

    return question;
  } catch (error) {
    console.log("An error occured trying to get company question by id", error);
    return null;
  }
}

export async function getAllAnswersByQuestionId(questionId: string) {
  try {
    const companyQuestionAnswers = await db
      .select()
      .from(answers)
      .where(eq(answers.companyQuestionId, questionId))
      .orderBy(desc(answers.createdAt));

    return companyQuestionAnswers;
  } catch (error) {
    console.log(
      "An error occured trying to get all answers by question id",
      error
    );
    return [];
  }
}
/**
 * Get all resource categories name and id
 * @returns All resource categories name and id
 */
export async function getAllResourceCategoriesNameAndId() {
  try {
    const allResourceCategories = await db
      .select({
        id: resourceCategories.id,
        name: resourceCategories.name,
      })
      .from(resourceCategories);

    return allResourceCategories;
  } catch (error) {
    console.log(
      "An error occured trying to get all resource categories",
      error
    );
    return [];
  }
}

/**
 * Get all resource categories
 * @returns All resource categories
 */
export async function getAllResourceCategories() {
  try {
    const allResourceCategories = await db
      .select()
      .from(resourceCategories)
      .orderBy(desc(resourceCategories.createdAt));

    return allResourceCategories;
  } catch (error) {
    console.log(
      "An error occured trying to get all resource categories",
      error
    );
    return [];
  }
}

/**
 * Get company questions by company id
 * @param companyId - The id of the company
 * @returns The company questions
 */
export async function getCompanyQuestionsByCompanyId(companyId: string) {
  try {
    return await db
      .select()
      .from(companyQuestions)
      .where(eq(companyQuestions.companyId, companyId))
      .orderBy(desc(companyQuestions.createdAt));
  } catch (error) {
    console.log(
      "An error occured trying to get company questions by company id",
      error
    );
    return [];
  }
}

/**
 * Get filtered company questions by company id
 * @param companyId - The id of the company
 * @param query - The query to filter the questions
 * @param offset - The offset to paginate the questions
 * @param limit - The limit to paginate the questions
 * @returns The filtered company questions
 */
export async function getFilteredCompanyQuestionsByCompanyId(
  companyId: string,
  query?: string,
  offset?: number,
  limit?: number
) {
  try {
    const whereClause = query
      ? ilike(companyQuestions.title, `%${query}%`)
      : undefined;

    const questions = await db
      .select()
      .from(companyQuestions)
      .where(and(eq(companyQuestions.companyId, companyId), whereClause))
      .orderBy(desc(companyQuestions.createdAt))
      .limit(limit ?? 50)
      .offset(offset ?? 0);

    const [{ total }] = await db
      .select({ total: count(companyQuestions.id) })
      .from(companyQuestions)
      .where(and(eq(companyQuestions.companyId, companyId), whereClause));

    const totalPages = Math.ceil(Number(total) / (limit ?? 50));

    return { questions, totalPages, totalQuestions: total };
  } catch (error) {
    console.log(
      "An error occurred trying to get filtered company questions by company id",
      error
    );
    return { questions: [], totalPages: 0, totalQuestions: 0 };
  }
}

/**
 * Get filtered companies with types
 * @param companyType - The type of the company
 * @returns The filtered companies
 */
export async function getFilteredCompaniesWithTypes(
  companyType?: string | string[]
) {
  try {
    let whereClause;

    if (companyType) {
      if (typeof companyType === "string") {
        whereClause = eq(
          company.type,
          companyType as (typeof company.type.enumValues)[number]
        );
      } else if (Array.isArray(companyType)) {
        whereClause = inArray(
          company.type,
          companyType as (typeof company.type.enumValues)[number][]
        );
      }
    }

    return await db
      .select({
        id: company.id,
        name: company.name,
        type: company.type,
        industry: company.industry,
        createdAt: company.createdAt,
      })
      .from(company)
      .where(whereClause)
      .orderBy(desc(company.createdAt));
  } catch (error) {
    console.log(
      "An error occured trying to get filtered companies with types",
      error
    );
    return [];
  }
}

export async function getCompanies() {
  try {
    return await db.select().from(company).orderBy(desc(company.createdAt));
  } catch (error) {
    console.log("An error occured trying to get companies", error);
    return [];
  }
}

/**
 * Get filtered resources by company id and categories
 * @param companyId - The id of the company
 * @param categories - The categories of the resources
 * @returns The filtered resources
 */
export async function getFilteredResourcesByCompanyId(
  companyId: string,
  categories?: string | string[],
  query?: string
) {
  try {
    // Normalize categories to an array of strings
    const categoryArray: string[] =
      typeof categories === "string"
        ? [categories]
        : Array.isArray(categories)
        ? categories
        : [];

    const whereClause = query
      ? ilike(resources.name, `%${query}%`)
      : categoryArray.length > 0
      ? and(
          eq(resources.companyId, companyId),
          inArray(resources.categoryId, categoryArray)
        )
      : eq(resources.companyId, companyId);

    const filteredResources = await db
      .select({
        id: resources.id,
        name: resources.name,
        description: resources.description,
        kind: resources.kind,
        createdAt: resources.createdAt,
        categoryId: resources.categoryId,
        categoryName: resourceCategories.name,
      })
      .from(resources)
      .leftJoin(
        resourceCategories,
        eq(resources.categoryId, resourceCategories.id)
      )
      .where(whereClause)
      .orderBy(desc(resources.createdAt));

    return filteredResources;
  } catch (error) {
    console.error(
      "An error occurred trying to get filtered resources by company id",
      error
    );
    return [];
  }
}

/**
 * Get resources by company id
 * @param companyId - The id of the company
 * @returns The resources
 */
export async function getResourcesWithCategoryByCompanyId(companyId: string) {
  try {
    const resourcesWithCategory = await db
      .select({
        id: resources.id,
        name: resources.name,
        description: resources.description,
        kind: resources.kind,
        createdAt: resources.createdAt,
        categoryId: resources.categoryId,
        categoryName: resourceCategories.name,
      })
      .from(resources)
      .where(eq(resources.companyId, companyId))
      .leftJoin(
        resourceCategories,
        eq(resources.categoryId, resourceCategories.id)
      )
      .orderBy(desc(resources.createdAt));

    return resourcesWithCategory;
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get resources by company id"
    );
  }
}

/**
 * Get resources by company id
 * @param companyId - The id of the company
 * @returns The resources
 */
export async function getResourcesByCompanyId(companyId: string) {
  try {
    return await db
      .select({
        id: resources.id,
        name: resources.name,
        description: resources.description,
      })
      .from(resources)
      .where(eq(resources.companyId, companyId))
      .orderBy(desc(resources.createdAt));
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get resources by company id"
    );
  }
}

export async function getCompanyById(companyId: string) {
  try {
    const [selectedCompany] = await db
      .select()
      .from(company)
      .where(eq(company.id, companyId));
    return selectedCompany;
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to get company");
  }
}

/**
 * Get a ticket by id
 * @param id - The id of the ticket
 * @returns The ticket
 */
export async function getTicketById({ id }: { id: string }) {
  try {
    const [selectedTicket] = await db
      .select()
      .from(ticket)
      .where(eq(ticket.id, id));
    return selectedTicket;
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get ticket by id"
    );
  }
}

/**
 * Get tickets by user id
 * @param userId - The id of the user
 * @returns The tickets
 */
export async function getTicketsByUserId({ userId }: { userId: string }) {
  try {
    return await db.select().from(ticket).where(eq(ticket.userId, userId));
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get tickets by user id"
    );
  }
}

/**
 * Get all tickets
 * @returns All tickets
 */
export async function getAllTickets() {
  try {
    return await db.select().from(ticket);
  } catch (error) {
    console.error(error);
    throw new ChatSDKError("bad_request:database", "Failed to get all tickets");
  }
}

/**
 * Get the name of a company by id
 * @param companyId - The id of the company
 * @returns The name of the company
 */
export async function getCompanyNameById(companyId: string) {
  try {
    const [selectedCompany] = await db
      .select({
        name: company.name,
      })
      .from(company)
      .where(eq(company.id, companyId));
    return selectedCompany;
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get company name by id"
    );
  }
}

/**
 * Create a new ticket
 * @param title - The title of the ticket
 * @param description - The description of the ticket
 * @param content - The content of the ticket
 * @param userId - The user id of the ticket
 * @param tags - The tags of the ticket
 * @returns The created ticket
 */
export async function createTicket(
  title: string,
  description: string,
  content: string,
  userId: string,
  tags: string[]
) {
  try {
    return await db
      .insert(ticket)
      .values({ title, description, userId, status: "open", tags })
      .returning();
  } catch (error) {
    console.error(error);
    throw new ChatSDKError("bad_request:database", "Failed to create ticket");
  }
}

export async function createUser(email: string, password: string) {
  const hashedPassword = generateHashedPassword(password);

  try {
    return await db.insert(user).values({ email, password: hashedPassword });
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to create user");
  }
}

export async function createGuestUser() {
  const email = `guest-${Date.now()}`;
  const password = generateHashedPassword(generateUUID());

  try {
    return await db.insert(user).values({ email, password }).returning({
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to create guest user"
    );
  }
}

export async function saveChat({
  id,
  userId,
  title,
  visibility,
}: {
  id: string;
  userId: string;
  title: string;
  visibility: VisibilityType;
}) {
  try {
    return await db.insert(chat).values({
      id,
      createdAt: new Date(),
      userId,
      title,
      visibility,
    });
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to save chat");
  }
}

export async function deleteChatById({ id }: { id: string }) {
  try {
    await db.delete(vote).where(eq(vote.chatId, id));
    await db.delete(message).where(eq(message.chatId, id));
    await db.delete(stream).where(eq(stream.chatId, id));

    const [chatsDeleted] = await db
      .delete(chat)
      .where(eq(chat.id, id))
      .returning();
    return chatsDeleted;
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to delete chat by id"
    );
  }
}

export async function getChatsByUserId({
  id,
  limit,
  startingAfter,
  endingBefore,
}: {
  id: string;
  limit: number;
  startingAfter: string | null;
  endingBefore: string | null;
}) {
  try {
    const extendedLimit = limit + 1;

    const query = (whereCondition?: SQL<any>) =>
      db
        .select()
        .from(chat)
        .where(
          whereCondition
            ? and(whereCondition, eq(chat.userId, id))
            : eq(chat.userId, id)
        )
        .orderBy(desc(chat.createdAt))
        .limit(extendedLimit);

    let filteredChats: Array<Chat> = [];

    if (startingAfter) {
      const [selectedChat] = await db
        .select()
        .from(chat)
        .where(eq(chat.id, startingAfter))
        .limit(1);

      if (!selectedChat) {
        throw new ChatSDKError(
          "not_found:database",
          `Chat with id ${startingAfter} not found`
        );
      }

      filteredChats = await query(gt(chat.createdAt, selectedChat.createdAt));
    } else if (endingBefore) {
      const [selectedChat] = await db
        .select()
        .from(chat)
        .where(eq(chat.id, endingBefore))
        .limit(1);

      if (!selectedChat) {
        throw new ChatSDKError(
          "not_found:database",
          `Chat with id ${endingBefore} not found`
        );
      }

      filteredChats = await query(lt(chat.createdAt, selectedChat.createdAt));
    } else {
      filteredChats = await query();
    }

    const hasMore = filteredChats.length > limit;

    return {
      chats: hasMore ? filteredChats.slice(0, limit) : filteredChats,
      hasMore,
    };
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get chats by user id"
    );
  }
}

export async function getChatById({ id }: { id: string }) {
  try {
    const [selectedChat] = await db.select().from(chat).where(eq(chat.id, id));
    return selectedChat;
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to get chat by id");
  }
}

export async function saveMessages({
  messages,
}: {
  messages: Array<DBMessage>;
}) {
  try {
    return await db.insert(message).values(messages);
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to save messages");
  }
}

export async function getMessagesByChatId({ id }: { id: string }) {
  try {
    return await db
      .select()
      .from(message)
      .where(eq(message.chatId, id))
      .orderBy(asc(message.createdAt));
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get messages by chat id"
    );
  }
}

export async function voteMessage({
  chatId,
  messageId,
  type,
}: {
  chatId: string;
  messageId: string;
  type: "up" | "down";
}) {
  try {
    const [existingVote] = await db
      .select()
      .from(vote)
      .where(and(eq(vote.messageId, messageId)));

    if (existingVote) {
      return await db
        .update(vote)
        .set({ isUpvoted: type === "up" })
        .where(and(eq(vote.messageId, messageId), eq(vote.chatId, chatId)));
    }
    return await db.insert(vote).values({
      chatId,
      messageId,
      isUpvoted: type === "up",
    });
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to vote message");
  }
}

export async function getVotesByChatId({ id }: { id: string }) {
  try {
    return await db.select().from(vote).where(eq(vote.chatId, id));
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get votes by chat id"
    );
  }
}

export async function saveDocument({
  id,
  title,
  kind,
  content,
  userId,
}: {
  id: string;
  title: string;
  kind: ArtifactKind;
  content: string;
  userId: string;
}) {
  try {
    return await db
      .insert(document)
      .values({
        id,
        title,
        kind,
        content,
        userId,
        createdAt: new Date(),
      })
      .returning();
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to save document");
  }
}

export async function getDocumentsById({ id }: { id: string }) {
  try {
    const documents = await db
      .select()
      .from(document)
      .where(eq(document.id, id))
      .orderBy(asc(document.createdAt));

    return documents;
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get documents by id"
    );
  }
}

export async function getDocumentById({ id }: { id: string }) {
  try {
    const [selectedDocument] = await db
      .select()
      .from(document)
      .where(eq(document.id, id))
      .orderBy(desc(document.createdAt));

    return selectedDocument;
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get document by id"
    );
  }
}

export async function deleteDocumentsByIdAfterTimestamp({
  id,
  timestamp,
}: {
  id: string;
  timestamp: Date;
}) {
  try {
    await db
      .delete(suggestion)
      .where(
        and(
          eq(suggestion.documentId, id),
          gt(suggestion.documentCreatedAt, timestamp)
        )
      );

    return await db
      .delete(document)
      .where(and(eq(document.id, id), gt(document.createdAt, timestamp)))
      .returning();
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to delete documents by id after timestamp"
    );
  }
}

export async function saveSuggestions({
  suggestions,
}: {
  suggestions: Array<Suggestion>;
}) {
  try {
    return await db.insert(suggestion).values(suggestions);
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to save suggestions"
    );
  }
}

export async function getSuggestionsByDocumentId({
  documentId,
}: {
  documentId: string;
}) {
  try {
    return await db
      .select()
      .from(suggestion)
      .where(and(eq(suggestion.documentId, documentId)));
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get suggestions by document id"
    );
  }
}

export async function getMessageById({ id }: { id: string }) {
  try {
    return await db.select().from(message).where(eq(message.id, id));
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get message by id"
    );
  }
}

export async function deleteMessagesByChatIdAfterTimestamp({
  chatId,
  timestamp,
}: {
  chatId: string;
  timestamp: Date;
}) {
  try {
    const messagesToDelete = await db
      .select({ id: message.id })
      .from(message)
      .where(
        and(eq(message.chatId, chatId), gte(message.createdAt, timestamp))
      );

    const messageIds = messagesToDelete.map((message) => message.id);

    if (messageIds.length > 0) {
      await db
        .delete(vote)
        .where(
          and(eq(vote.chatId, chatId), inArray(vote.messageId, messageIds))
        );

      return await db
        .delete(message)
        .where(
          and(eq(message.chatId, chatId), inArray(message.id, messageIds))
        );
    }
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to delete messages by chat id after timestamp"
    );
  }
}

export async function updateChatVisiblityById({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: "private" | "public";
}) {
  try {
    return await db.update(chat).set({ visibility }).where(eq(chat.id, chatId));
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to update chat visibility by id"
    );
  }
}

export async function getMessageCountByUserId({
  id,
  differenceInHours,
}: {
  id: string;
  differenceInHours: number;
}) {
  try {
    const twentyFourHoursAgo = new Date(
      Date.now() - differenceInHours * 60 * 60 * 1000
    );

    const [stats] = await db
      .select({ count: count(message.id) })
      .from(message)
      .innerJoin(chat, eq(message.chatId, chat.id))
      .where(
        and(
          eq(chat.userId, id),
          gte(message.createdAt, twentyFourHoursAgo),
          eq(message.role, "user")
        )
      )
      .execute();

    return stats?.count ?? 0;
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get message count by user id"
    );
  }
}

export async function createStreamId({
  streamId,
  chatId,
}: {
  streamId: string;
  chatId: string;
}) {
  try {
    await db
      .insert(stream)
      .values({ id: streamId, chatId, createdAt: new Date() });
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to create stream id"
    );
  }
}

export async function getStreamIdsByChatId({ chatId }: { chatId: string }) {
  try {
    const streamIds = await db
      .select({ id: stream.id })
      .from(stream)
      .where(eq(stream.chatId, chatId))
      .orderBy(asc(stream.createdAt))
      .execute();

    return streamIds.map(({ id }) => id);
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get stream ids by chat id"
    );
  }
}
