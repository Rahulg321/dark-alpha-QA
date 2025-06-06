import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
import { xai } from "@ai-sdk/xai";
import { isTestEnvironment } from "../constants";
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from "./models.test";
import { createOpenAI } from "@ai-sdk/openai";
import OpenAI from "openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { GoogleGenAI } from "@google/genai";

export const googleGenAIProvider = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_AI_KEY,
});

export const googleProvider = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GEMINI_AI_KEY,
});

const openai = createOpenAI({
  apiKey: process.env.AI_API_KEY,
  compatibility: "strict",
});

export const openaiProvider = createOpenAI({
  apiKey: process.env.AI_API_KEY,
  compatibility: "strict",
});

export const openaiClient = new OpenAI({
  apiKey: process.env.AI_API_KEY,
});

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        "chat-model": chatModel,
        "chat-model-reasoning": reasoningModel,
        "title-model": titleModel,
        "artifact-model": artifactModel,
        "gemini-flash": googleProvider("gemini-2.0-flash"),
        "gemini-reasoning": wrapLanguageModel({
          model: googleProvider("gemini-2.0-pro"),
          middleware: extractReasoningMiddleware({ tagName: "think" }),
        }),
      },
    })
  : customProvider({
      languageModels: {
        "chat-model": openaiProvider("o4-mini"),
        "chat-model-reasoning": wrapLanguageModel({
          model: openaiProvider("gpt-o3-mini"),
          middleware: extractReasoningMiddleware({ tagName: "think" }),
        }),
        "title-model": openaiProvider("gpt-4.5-preview"),
        "artifact-model": openaiProvider("gpt-4.5-preview"),
        "gemini-flash": googleProvider("gemini-2.0-flash-001"),
        "gemini-reasoning": wrapLanguageModel({
          model: googleProvider("gemini-2.0-pro"),
          middleware: extractReasoningMiddleware({ tagName: "think" }),
        }),
      },
    });
