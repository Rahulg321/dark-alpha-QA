import { relations } from "drizzle-orm/relations";
import { chat, message, stream, user, suggestion, messageV2, company, comparisonQuestions, resources, embeddings, resourceCategories, companyQuestions, answers, travel, voteV2, vote } from "./schema";

export const messageRelations = relations(message, ({one, many}) => ({
	chat: one(chat, {
		fields: [message.chatId],
		references: [chat.id]
	}),
	votes: many(vote),
}));

export const chatRelations = relations(chat, ({many}) => ({
	messages: many(message),
	streams: many(stream),
	messageV2s: many(messageV2),
	voteV2s: many(voteV2),
	votes: many(vote),
}));

export const streamRelations = relations(stream, ({one}) => ({
	chat: one(chat, {
		fields: [stream.chatId],
		references: [chat.id]
	}),
}));

export const suggestionRelations = relations(suggestion, ({one}) => ({
	user: one(user, {
		fields: [suggestion.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	suggestions: many(suggestion),
	travels: many(travel),
}));

export const messageV2Relations = relations(messageV2, ({one, many}) => ({
	chat: one(chat, {
		fields: [messageV2.chatId],
		references: [chat.id]
	}),
	voteV2s: many(voteV2),
}));

export const comparisonQuestionsRelations = relations(comparisonQuestions, ({one}) => ({
	company: one(company, {
		fields: [comparisonQuestions.companyId],
		references: [company.id]
	}),
}));

export const companyRelations = relations(company, ({many}) => ({
	comparisonQuestions: many(comparisonQuestions),
	resources: many(resources),
	companyQuestions: many(companyQuestions),
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

export const resourceCategoriesRelations = relations(resourceCategories, ({many}) => ({
	resources: many(resources),
}));

export const companyQuestionsRelations = relations(companyQuestions, ({one, many}) => ({
	company: one(company, {
		fields: [companyQuestions.companyId],
		references: [company.id]
	}),
	answers: many(answers),
}));

export const answersRelations = relations(answers, ({one}) => ({
	companyQuestion: one(companyQuestions, {
		fields: [answers.companyQuestionId],
		references: [companyQuestions.id]
	}),
}));

export const travelRelations = relations(travel, ({one}) => ({
	user: one(user, {
		fields: [travel.userId],
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