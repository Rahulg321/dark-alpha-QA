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
  pgEnum,
  integer,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import type { AdapterAccountType } from "next-auth/adapters";

const userRole = pgEnum("userRole", ["USER", "ADMIN"]);

export const user = pgTable("user", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  name: text("name"),
  email: varchar("email", { length: 64 }).notNull(),
  password: varchar("password", { length: 64 }),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  facebookUrl: text("facebookUrl"),
  role: userRole("role").notNull().default("USER"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export type User = InferSelectModel<typeof user>;

export const accounts = pgTable(
  "account",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ]
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: uuid("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ]
);

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
    type: varchar("type", { enum: ["website", "email"] }).notNull(),
    priority: varchar("priority", { enum: ["low", "medium", "high"] })
      .notNull()
      .default("low"),
    fromName: text("from_name").notNull(),
    fromEmail: text("from_email").notNull(),
    tags: text("tags").array().notNull().default([]),
    description: text("description"),
    status: varchar("status", { enum: ["open", "closed"] })
      .notNull()
      .default("open"),
    userId: uuid("userId").references(() => user.id),
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

export const ticketReplies = pgTable(
  "ticket_replies",
  {
    id: uuid("id").notNull().defaultRandom(),
    ticketId: uuid("ticket_id")
      .notNull()
      .references(() => ticket.id),
    subject: text("subject").notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    userId: uuid("userId")
      .references(() => user.id)
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    ticketRef: foreignKey({
      columns: [table.ticketId],
      foreignColumns: [ticket.id],
    }),
    userIdRef: foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
    }),
  })
);

export type TicketReplies = InferSelectModel<typeof ticketReplies>;

export const company = pgTable(
  "company",
  {
    id: uuid("id").notNull().defaultRandom(),
    name: text("name").notNull(),
    type: varchar("type", {
      enum: [
        "enterprise",
        "consultancy",
        "agency",
        "research",
        "mature",
        "startup",
        "growth_equity",
        "distressed",
        "other",
      ],
    })
      .notNull()
      .default("other"),
    website: text("website"),
    email: text("email"),
    industry: varchar("industry", {
      enum: [
        "technology",
        "finance",
        "healthcare",
        "education",
        "energy",
        "manufacturing",
        "retail",
        "other",
      ],
    })
      .notNull()
      .default("other"),

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

export const comparisonQuestions = pgTable(
  "comparison_questions",
  {
    id: uuid("id").notNull().defaultRandom(),
    userQuery: text("user_query").notNull(),
    resourceIds: uuid("resource_ids").array().notNull(),
    answer: text("answer").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => company.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    companyIdRef: foreignKey({
      columns: [table.companyId],
      foreignColumns: [company.id],
    }),
  })
);

export type ComparisonQuestion = InferSelectModel<typeof comparisonQuestions>;

export const twoFactorConfirmation = pgTable("two_factor_confirmation", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("userId")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
});

export type TwoFactorConfirmation = InferSelectModel<
  typeof twoFactorConfirmation
>;

export const passwordResetToken = pgTable(
  "password_reset_token",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    email: text("email").notNull(),
    token: text("token").notNull().unique(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => ({
    emailTokenUnique: uniqueIndex("password_reset_token_email_token_unique").on(
      table.email,
      table.token
    ),
  })
);

export type PasswordResetToken = InferSelectModel<typeof passwordResetToken>;

export const twoFactorToken = pgTable(
  "two_factor_token",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    email: text("email").notNull(),
    token: text("token").notNull().unique(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => ({
    emailTokenUnique: uniqueIndex("two_factor_token_email_token_unique").on(
      table.email,
      table.token
    ),
  })
);

export type TwoFactorToken = InferSelectModel<typeof twoFactorToken>;

export const verificationToken = pgTable(
  "verification_token",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    email: text("email").notNull(),
    token: text("token").notNull().unique(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => ({
    emailTokenUnique: uniqueIndex("verification_token_email_token_unique").on(
      table.email,
      table.token
    ),
  })
);

export type VerificationToken = InferSelectModel<typeof verificationToken>;

export const travel = pgTable("travel", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  name: text("name").notNull(),
  userId: uuid("userId")
    .references(() => user.id)
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
