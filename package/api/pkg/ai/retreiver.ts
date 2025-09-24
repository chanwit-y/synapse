import { DistanceStrategy, PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { EmbeddingsInterface } from '@langchain/core/embeddings';
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { PoolConfig } from "pg";
import { VectorStoreRetriever } from "@langchain/core/vectorstores";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
    path: path.resolve(__dirname, '../../.env'),
});

export type createRetreiverType = {
    embeddings: EmbeddingsInterface,
    vectorTableName: string,
    columns: { idColumnName: string, vectorColumnName: string, contentColumnName: string, metadataColumnName: string },
    topK: number,
}

export const createRetriever = async ({ embeddings, vectorTableName, columns, topK }: createRetreiverType): Promise<VectorStoreRetriever<PGVectorStore>> => {
    const config = {
        postgresConnectionOptions: {
            connectionString: process.env.DATABASE_URL,
        } as PoolConfig,
        tableName: vectorTableName,
        columns: columns,
        // supported distance strategies: cosine (default), innerProduct, or euclidean
        distanceStrategy: "cosine" as DistanceStrategy,
    };
    const vectorStore = await PGVectorStore.initialize(embeddings, config);
    return vectorStore.asRetriever(topK);
}

export type askAIType = {
    q: string,
    retreiver: VectorStoreRetriever<PGVectorStore>,
    llm: BaseChatModel,
}

export const askAI = async ({ q, retreiver, llm }: askAIType) => {
    const results = await retreiver.invoke(q);
    const ctx = results.map((d) => d.pageContent).slice(0, 5).join('\n---\n')
    const messages = [
        new SystemMessage(`Today is ${new Date().toLocaleDateString()}. You are a helpful assistant. Use the following context to answer the question:\n${ctx}`),
        new HumanMessage(q),
    ]

    const executor = await llm.invoke(messages)
    return executor.content
}