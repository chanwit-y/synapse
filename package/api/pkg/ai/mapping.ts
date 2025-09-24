import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { CustomGeminiEmbeddings } from "./embedding";
import { createRetriever } from "./retreiver";

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
            retreiver: await createRetriever({ embeddings: new CustomGeminiEmbeddings(process.env.GEMINI_EMBEDING_001_MODEL!), vectorTableName: table.vectorTableName, columns: table.columns, topK: topK }),
            llm: new ChatGoogleGenerativeAI({ model: model, apiKey: process.env.GOOGLE_API_KEY!, temperature: 0 })
        }
    }
}