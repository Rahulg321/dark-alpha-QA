import { pgTable, foreignKey, uuid, timestamp, text, varchar, json, unique, index, vector, boolean, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const chat = pgTable("Chat", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp({ mode: 'string' }).notNull(),
	title: text().notNull(),
	userId: uuid().notNull(),
	visibility: varchar().default('private').notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "Chat_userId_User_id_fk"
		}),
]);

export const company = pgTable("company", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	type: varchar().default('other').notNull(),
	website: text(),
	email: text(),
	industry: varchar().default('other').notNull(),
	address: text(),
	description: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const companyQuestions = pgTable("company_questions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	companyId: uuid("company_id").notNull(),
	title: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [company.id],
			name: "company_questions_company_id_company_id_fk"
		}),
]);

export const answers = pgTable("answers", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	companyQuestionId: uuid("company_question_id").notNull(),
	answer: text().notNull(),
	type: varchar().default('AI_GENERATED').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.companyQuestionId],
			foreignColumns: [companyQuestions.id],
			name: "answers_company_question_id_company_questions_id_fk"
		}),
]);

export const comparisonQuestions = pgTable("comparison_questions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userQuery: text("user_query").notNull(),
	resourceIds: uuid("resource_ids").array().notNull(),
	answer: text().notNull(),
	companyId: uuid("company_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [company.id],
			name: "comparison_questions_company_id_company_id_fk"
		}),
]);

export const message = pgTable("Message", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	chatId: uuid().notNull(),
	role: varchar().notNull(),
	content: json().notNull(),
	createdAt: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.chatId],
			foreignColumns: [chat.id],
			name: "Message_chatId_Chat_id_fk"
		}),
]);

export const resourceCategories = pgTable("resource_categories", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("resource_categories_name_unique").on(table.name),
]);

export const embeddings = pgTable("embeddings", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	resourceId: uuid("resource_id").notNull(),
	content: text().notNull(),
	embedding: vector({ dimensions: 1536 }).notNull(),
}, (table) => [
	index("embeddingIndex").using("hnsw", table.embedding.asc().nullsLast().op("vector_cosine_ops")),
	foreignKey({
			columns: [table.resourceId],
			foreignColumns: [resources.id],
			name: "embeddings_resource_id_resources_id_fk"
		}),
]);

export const stream = pgTable("Stream", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	chatId: uuid().notNull(),
	createdAt: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.chatId],
			foreignColumns: [chat.id],
			name: "Stream_chatId_Chat_id_fk"
		}),
]);

export const ticket = pgTable("Ticket", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	title: text().notNull(),
	type: varchar().notNull(),
	priority: varchar().default('low').notNull(),
	fromName: text("from_name").notNull(),
	fromEmail: text("from_email").notNull(),
	tags: text().array().notNull(),
	description: text(),
	status: varchar().default('open').notNull(),
});

export const user = pgTable("User", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: varchar({ length: 64 }).notNull(),
	password: varchar({ length: 64 }),
});

export const resources = pgTable("resources", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	companyId: uuid("company_id").notNull(),
	categoryId: uuid("category_id"),
	name: text().notNull(),
	description: text(),
	content: text(),
	fileUrl: text("file_url"),
	kind: varchar().default('pdf').notNull(),
	tags: text().array(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [company.id],
			name: "resources_company_id_company_id_fk"
		}),
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [resourceCategories.id],
			name: "resources_category_id_resource_categories_id_fk"
		}),
]);

export const messageV2 = pgTable("Message_v2", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	chatId: uuid().notNull(),
	role: varchar().notNull(),
	parts: json().notNull(),
	attachments: json().notNull(),
	createdAt: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.chatId],
			foreignColumns: [chat.id],
			name: "Message_v2_chatId_Chat_id_fk"
		}),
]);

export const suggestion = pgTable("Suggestion", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	documentId: uuid().notNull(),
	documentCreatedAt: timestamp({ mode: 'string' }).notNull(),
	originalText: text().notNull(),
	suggestedText: text().notNull(),
	description: text(),
	isResolved: boolean().default(false).notNull(),
	userId: uuid().notNull(),
	createdAt: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "Suggestion_userId_User_id_fk"
		}),
	foreignKey({
			columns: [table.documentId, table.documentCreatedAt],
			foreignColumns: [document.id, document.createdAt],
			name: "Suggestion_documentId_documentCreatedAt_Document_id_createdAt_f"
		}),
]);

export const voteV2 = pgTable("Vote_v2", {
	chatId: uuid().notNull(),
	messageId: uuid().notNull(),
	isUpvoted: boolean().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.chatId],
			foreignColumns: [chat.id],
			name: "Vote_v2_chatId_Chat_id_fk"
		}),
	foreignKey({
			columns: [table.messageId],
			foreignColumns: [messageV2.id],
			name: "Vote_v2_messageId_Message_v2_id_fk"
		}),
	primaryKey({ columns: [table.chatId, table.messageId], name: "Vote_v2_chatId_messageId_pk"}),
]);

export const vote = pgTable("Vote", {
	chatId: uuid().notNull(),
	messageId: uuid().notNull(),
	isUpvoted: boolean().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.chatId],
			foreignColumns: [chat.id],
			name: "Vote_chatId_Chat_id_fk"
		}),
	foreignKey({
			columns: [table.messageId],
			foreignColumns: [message.id],
			name: "Vote_messageId_Message_id_fk"
		}),
	primaryKey({ columns: [table.chatId, table.messageId], name: "Vote_chatId_messageId_pk"}),
]);

export const document = pgTable("Document", {
	id: uuid().defaultRandom().notNull(),
	createdAt: timestamp({ mode: 'string' }).notNull(),
	title: text().notNull(),
	content: text(),
	text: varchar().default('text').notNull(),
	userId: uuid().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "Document_userId_User_id_fk"
		}),
	primaryKey({ columns: [table.id, table.createdAt], name: "Document_id_createdAt_pk"}),
]);
