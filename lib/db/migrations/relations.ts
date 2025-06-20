import { relations } from "drizzle-orm/relations";
import { user, chat, company, companyQuestions, answers, comparisonQuestions, message, resources, embeddings, stream, resourceCategories, messageV2, suggestion, document, voteV2, vote } from "./schema";

export const chatRelations = relations(chat, ({one, many}) => ({
	user: one(user, {
		fields: [chat.userId],
		references: [user.id]
	}),
	messages: many(message),
	streams: many(stream),
	messageV2s: many(messageV2),
	voteV2s: many(voteV2),
	votes: many(vote),
}));

export const userRelations = relations(user, ({many}) => ({
	chats: many(chat),
	suggestions: many(suggestion),
	documents: many(document),
}));

export const companyQuestionsRelations = relations(companyQuestions, ({one, many}) => ({
	company: one(company, {
		fields: [companyQuestions.companyId],
		references: [company.id]
	}),
	answers: many(answers),
}));

export const companyRelations = relations(company, ({many}) => ({
	companyQuestions: many(companyQuestions),
	comparisonQuestions: many(comparisonQuestions),
	resources: many(resources),
}));

export const answersRelations = relations(answers, ({one}) => ({
	companyQuestion: one(companyQuestions, {
		fields: [answers.companyQuestionId],
		references: [companyQuestions.id]
	}),
}));

export const comparisonQuestionsRelations = relations(comparisonQuestions, ({one}) => ({
	company: one(company, {
		fields: [comparisonQuestions.companyId],
		references: [company.id]
	}),
}));

export const messageRelations = relations(message, ({one, many}) => ({
	chat: one(chat, {
		fields: [message.chatId],
		references: [chat.id]
	}),
	votes: many(vote),
}));

export const embeddingsRelations = relations(embeddings, ({one}) => ({
	resource: one(resources, {
		fields: [embeddings.resourceId],
		references: [resources.id]
	}),
}));

export const resourcesRelations = relations(resources, ({one, many}) => ({
	embeddings: many(embeddings),
	company: one(company, {
		fields: [resources.companyId],
		references: [company.id]
	}),
	resourceCategory: one(resourceCategories, {
		fields: [resources.categoryId],
		references: [resourceCategories.id]
	}),
}));

export const streamRelations = relations(stream, ({one}) => ({
	chat: one(chat, {
		fields: [stream.chatId],
		references: [chat.id]
	}),
}));

export const resourceCategoriesRelations = relations(resourceCategories, ({many}) => ({
	resources: many(resources),
}));

export const messageV2Relations = relations(messageV2, ({one, many}) => ({
	chat: one(chat, {
		fields: [messageV2.chatId],
		references: [chat.id]
	}),
	voteV2s: many(voteV2),
}));

export const suggestionRelations = relations(suggestion, ({one}) => ({
	user: one(user, {
		fields: [suggestion.userId],
		references: [user.id]
	}),
	document: one(document, {
		fields: [suggestion.documentId],
		references: [document.id]
	}),
}));

export const documentRelations = relations(document, ({one, many}) => ({
	suggestions: many(suggestion),
	user: one(user, {
		fields: [document.userId],
		references: [user.id]
	}),
}));

export const voteV2Relations = relations(voteV2, ({one}) => ({
	chat: one(chat, {
		fields: [voteV2.chatId],
		references: [chat.id]
	}),
	messageV2: one(messageV2, {
		fields: [voteV2.messageId],
		references: [messageV2.id]
	}),
}));

export const voteRelations = relations(vote, ({one}) => ({
	chat: one(chat, {
		fields: [vote.chatId],
		references: [chat.id]
	}),
	message: one(message, {
		fields: [vote.messageId],
		references: [message.id]
	}),
}));