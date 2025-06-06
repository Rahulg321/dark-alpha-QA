import type { InferSelectModel } from "drizzle-orm";
import {
  pgTable,
  varchar,
  timestamp,
  json,
  uuid,
  text,
  primaryKey,
  foreignKey,
  boolean,
  index,
  vector,
} from "drizzle-orm/pg-core";
import { z } from "zod";
import { createSelectSchema } from "drizzle-zod";

export const user = pgTable("User", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  email: varchar("email", { length: 64 }).notNull(),
  password: varchar("password", { length: 64 }),
});

export type User = InferSelectModel<typeof user>;

export const chat = pgTable("Chat", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  createdAt: timestamp("createdAt").notNull(),
  title: text("title").notNull(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id),
  visibility: varchar("visibility", { enum: ["public", "private"] })
    .notNull()
    .default("private"),
});

export type Chat = InferSelectModel<typeof chat>;

// DEPRECATED: The following schema is deprecated and will be removed in the future.
// Read the migration guide at https://chat-sdk.dev/docs/migration-guides/message-parts
export const messageDeprecated = pgTable("Message", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  chatId: uuid("chatId")
    .notNull()
    .references(() => chat.id),
  role: varchar("role").notNull(),
  content: json("content").notNull(),
  createdAt: timestamp("createdAt").notNull(),
});

export type MessageDeprecated = InferSelectModel<typeof messageDeprecated>;

export const message = pgTable("Message_v2", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  chatId: uuid("chatId")
    .notNull()
    .references(() => chat.id),
  role: varchar("role").notNull(),
  parts: json("parts").notNull(),
  attachments: json("attachments").notNull(),
  createdAt: timestamp("createdAt").notNull(),
});

export type DBMessage = InferSelectModel<typeof message>;

// DEPRECATED: The following schema is deprecated and will be removed in the future.
// Read the migration guide at https://chat-sdk.dev/docs/migration-guides/message-parts
export const voteDeprecated = pgTable(
  "Vote",
  {
    chatId: uuid("chatId")
      .notNull()
      .references(() => chat.id),
    messageId: uuid("messageId")
      .notNull()
      .references(() => messageDeprecated.id),
    isUpvoted: boolean("isUpvoted").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.chatId, table.messageId] }),
    };
  }
);

export type VoteDeprecated = InferSelectModel<typeof voteDeprecated>;

export const vote = pgTable(
  "Vote_v2",
  {
    chatId: uuid("chatId")
      .notNull()
      .references(() => chat.id),
    messageId: uuid("messageId")
      .notNull()
      .references(() => message.id),
    isUpvoted: boolean("isUpvoted").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.chatId, table.messageId] }),
    };
  }
);

export type Vote = InferSelectModel<typeof vote>;

export const document = pgTable(
  "Document",
  {
    id: uuid("id").notNull().defaultRandom(),
    createdAt: timestamp("createdAt").notNull(),
    title: text("title").notNull(),
    content: text("content"),
    kind: varchar("text", { enum: ["text", "code", "image", "sheet"] })
      .notNull()
      .default("text"),
    userId: uuid("userId")
      .notNull()
      .references(() => user.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.id, table.createdAt] }),
    };
  }
);

export type Document = InferSelectModel<typeof document>;

export const suggestion = pgTable(
  "Suggestion",
  {
    id: uuid("id").notNull().defaultRandom(),
    documentId: uuid("documentId").notNull(),
    documentCreatedAt: timestamp("documentCreatedAt").notNull(),
    originalText: text("originalText").notNull(),
    suggestedText: text("suggestedText").notNull(),
    description: text("description"),
    isResolved: boolean("isResolved").notNull().default(false),
    userId: uuid("userId")
      .notNull()
      .references(() => user.id),
    createdAt: timestamp("createdAt").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    documentRef: foreignKey({
      columns: [table.documentId, table.documentCreatedAt],
      foreignColumns: [document.id, document.createdAt],
    }),
  })
);

export type Suggestion = InferSelectModel<typeof suggestion>;

export const stream = pgTable(
  "Stream",
  {
    id: uuid("id").notNull().defaultRandom(),
    chatId: uuid("chatId").notNull(),
    createdAt: timestamp("createdAt").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    chatRef: foreignKey({
      columns: [table.chatId],
      foreignColumns: [chat.id],
    }),
  })
);

export type Stream = InferSelectModel<typeof stream>;

export const ticket = pgTable(
  "Ticket",
  {
    id: uuid("id").notNull().defaultRandom(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    title: text("title").notNull(),
    tags: text("tags").array().notNull(),
    description: text("description"),
    status: varchar("status", { enum: ["open", "closed"] })
      .notNull()
      .default("open"),
    userId: uuid("userId")
      .notNull()
      .references(() => user.id),
  },
  (pgTable) => ({
    pk: primaryKey({ columns: [pgTable.id] }),
    userIdRef: foreignKey({
      columns: [pgTable.userId],
      foreignColumns: [user.id],
    }),
  })
);

export type Ticket = InferSelectModel<typeof ticket>;

export const company = pgTable(
  "company",
  {
    id: uuid("id").notNull().defaultRandom(),
    name: text("name").notNull(),
    type: varchar("type", {
      enum: ["enterprise", "consultancy", "agency", "research", "other"],
    })
      .notNull()
      .default("other"),
    website: text("website"),
    email: text("email"),
    address: text("address"),
    description: text("description"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
  })
);

export const companyQuestions = pgTable(
  "company_questions",
  {
    id: uuid("id").notNull().defaultRandom(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => company.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    companyIdRef: foreignKey({
      columns: [table.companyId],
      foreignColumns: [company.id],
    }),
  })
);

export type CompanyQuestions = InferSelectModel<typeof companyQuestions>;

export type Company = InferSelectModel<typeof company>;

export const answers = pgTable(
  "answers",
  {
    id: uuid("id").notNull().defaultRandom(),
    companyQuestionId: uuid("company_question_id")
      .notNull()
      .references(() => companyQuestions.id, { onDelete: "cascade" }),
    answer: text("answer").notNull(),
    type: varchar("type", {
      enum: ["AI_GENERATED", "MANUAL"],
    })
      .notNull()
      .default("AI_GENERATED"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    companyQuestionIdRef: foreignKey({
      columns: [table.companyQuestionId],
      foreignColumns: [companyQuestions.id],
    }),
  })
);

export type Answers = InferSelectModel<typeof answers>;

export const resources = pgTable(
  "resources",
  {
    id: uuid("id").notNull().defaultRandom(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => company.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id").references(() => resourceCategories.id, {
      onDelete: "cascade",
    }),
    name: text("name").notNull(),
    description: text("description"),
    content: text("content"),
    fileUrl: text("file_url"),
    kind: varchar("kind", {
      enum: [
        "pdf",
        "doc",
        "docx",
        "txt",
        "jpg",
        "jpeg",
        "png",
        "gif",
        "webp",
        "xls",
        "xlsx",
        "image",
        "excel",
        "audio",
      ],
    })
      .notNull()
      .default("pdf"),
    tags: text("tags").array(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (pgTable) => ({
    companyIdRef: foreignKey({
      columns: [pgTable.companyId],
      foreignColumns: [company.id],
    }),
    categoryIdRef: foreignKey({
      columns: [pgTable.categoryId],
      foreignColumns: [resourceCategories.id],
    }),
    pk: primaryKey({ columns: [pgTable.id] }),
  })
);

// Schema for resources - used to validate API requests
export const insertResourceSchema = createSelectSchema(resources)
  .extend({})
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    tags: true,
  });

export type Resource = InferSelectModel<typeof resources>;

export const embeddings = pgTable(
  "embeddings",
  {
    id: uuid("id").notNull().defaultRandom(),

    resourceId: uuid("resource_id")
      .notNull()
      .references(() => resources.id, { onDelete: "cascade" }),

    content: text("content").notNull(),
    embedding: vector("embedding", { dimensions: 1536 }).notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    resourceIdRef: foreignKey({
      columns: [table.resourceId],
      foreignColumns: [resources.id],
    }),
    embeddingIndex: index("embeddingIndex").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops")
    ),
  })
);

export type Embedding = InferSelectModel<typeof embeddings>;

// Resource Categories Table
export const resourceCategories = pgTable(
  "resource_categories",
  {
    id: uuid("id").notNull().defaultRandom(),
    name: text("name").notNull().unique(),
    description: text("description"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
  })
);

export type ResourceCategory = InferSelectModel<typeof resourceCategories>;
