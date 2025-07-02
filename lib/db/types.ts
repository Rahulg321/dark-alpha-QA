// Pure types file without database connection
export const companyTypes = [
  "enterprise",
  "consultancy", 
  "agency",
  "research",
  "mature",
  "startup",
  "growth_equity",
  "distressed",
  "other",
] as const;

export const companyIndustries = [
  "technology",
  "finance",
  "healthcare", 
  "education",
  "energy",
  "manufacturing",
  "retail",
  "other",
] as const;

export const ticketTypes = ["website", "email"] as const;
export const ticketPriorities = ["low", "medium", "high"] as const;
export const ticketStatuses = ["open", "closed"] as const;

export const resourceKinds = [
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
] as const;

export const answerTypes = ["AI_GENERATED", "MANUAL"] as const;

// Database types (re-exported from schema without DB connection)
export type {
  User,
  Chat, 
  Ticket,
  Reply,
  ResourceCategory,
  Resource,
  Company,
  CompanyQuestions,
  Answers,
  Embedding,
  ComparisonQuestion,
  DBMessage,
  Vote,
  Document,
  Suggestion,
  Stream,
} from "./schema";