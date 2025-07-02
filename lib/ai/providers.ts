import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
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

export const googleAISDKProvider = createGoogleGenerativeAI({
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
        "gemini-flash": googleAISDKProvider("gemini-2.0-flash"),
        "gemini-reasoning": wrapLanguageModel({
          model: googleAISDKProvider("gemini-2.5-pro-preview-05-06"),
          middleware: extractReasoningMiddleware({ tagName: "think" }),
        }),
      },
    })
  : customProvider({
      languageModels: {
        "chat-model": openaiProvider("gpt-4.1"),
        "chat-model-reasoning": wrapLanguageModel({
          model: openaiProvider("o1-mini"),
          middleware: extractReasoningMiddleware({ tagName: "think" }),
        }),
        "title-model": openaiProvider("gpt-4.5-preview"),
        "artifact-model": openaiProvider("gpt-4.5-preview"),
        "gemini-flash": googleAISDKProvider("gemini-2.5-flash-preview-04-17"),
        "gemini-reasoning": wrapLanguageModel({
          model: googleAISDKProvider("gemini-2.5-pro-preview-05-06"),
          middleware: extractReasoningMiddleware({ tagName: "think" }),
        }),
      },
    });
