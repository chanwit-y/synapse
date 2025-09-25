import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { CustomGeminiEmbeddings, CustomOpenAIEmbeddings } from "./embedding";
import { createRetriever } from "./retreiver";
import { ChatOpenAI } from "@langchain/openai";
import { extendNoteByGemini, extendNoteByOpenAI } from "./extend_note";

const topicMapping = {
    note: {
        vectorTableName: "note_chunk",
        columns: { idColumnName: "id", vectorColumnName: "embedding", contentColumnName: "content", metadataColumnName: "metadata" },
    }
}

export const aiMapping = {
    gemini: async (model: string, topic: keyof typeof topicMapping, topK: number = 5) => {

        const table = topicMapping[topic as keyof typeof topicMapping]

        return {
            retreiver: await createRetriever({ embeddings: new CustomGeminiEmbeddings(process.env.GEMINI_EMBEDDING_001_MODEL!), vectorTableName: table.vectorTableName, columns: table.columns, topK: topK }),
            llm: new ChatGoogleGenerativeAI({ model: model, apiKey: process.env.GOOGLE_API_KEY!, temperature: 0 }),
            embeddings: new CustomGeminiEmbeddings(process.env.GEMINI_EMBEDDING_001_MODEL!),
        }
    },
    openai: async (model: string, topic: keyof typeof topicMapping, topK: number = 5) => {
        const table = topicMapping[topic as keyof typeof topicMapping]

        return {
            retreiver: await createRetriever({ embeddings: new CustomOpenAIEmbeddings(process.env.OPEN_AI_EMBEDDING_TEXT_EMBEDDING_3_L!), vectorTableName: table.vectorTableName, columns: table.columns, topK: topK }),
            llm: new ChatOpenAI({ model: model, apiKey: process.env.OPENAI_API_KEY!, temperature: defaultOpenAITemperature[model as keyof typeof defaultOpenAITemperature] }),
            embeddings: new CustomOpenAIEmbeddings(process.env.OPEN_AI_EMBEDDING_TEXT_EMBEDDING_3_L!),
        }
    }
}

export const embeddingsAI = {
    gemini: new CustomGeminiEmbeddings(process.env.GEMINI_EMBEDDING_001_MODEL!),
    openai: new CustomOpenAIEmbeddings(process.env.OPEN_AI_EMBEDDING_TEXT_EMBEDDING_3_L!),
}

export const extendNoteAI = {
    gemini: extendNoteByGemini,
    openai: extendNoteByOpenAI,
}

export const defaultOpenAITemperature = {
    "gpt-5-mini": 1,
    "gpt-5": 1,
    "gpt-4.1": 0,
}

export const allowanceAIChatModel = {
    gemini: [process.env.GEMINI_2_5_PRO_MODEL],
    openai: [process.env.OPEN_AI_GPT_5_MINI_MODEL, process.env.OPEN_AI_GPT_5_MODEL, process.env.OPEN_AI_GPT_4_1_MODEL],
}