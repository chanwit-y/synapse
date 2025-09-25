import { DistanceStrategy, PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { EmbeddingsInterface } from '@langchain/core/embeddings';
import { HumanMessage, SystemMessage, ToolMessage } from "@langchain/core/messages";
import { PoolConfig } from "pg";
import { VectorStoreRetriever } from "@langchain/core/vectorstores";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";

import dotenv from 'dotenv';
import path from 'path';
import { openAIChat, openAISDKChat } from "./tools/openai_chat";
import { toolsByName } from "./tools";
import { NO_ANSWER_MESSAGE } from "../constant/ai";
import { log } from "console";

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
        new SystemMessage(`Today is ${new Date().toLocaleDateString()}. You are a helpful assistant. Use the following context to answer the question:\n${ctx}\n
        if you don't have the answer you must be follow below rules:
        *** important rules ***
            1. you must be use available tools includes ${Object.keys(toolsByName).join(", ")} to answer the question.
            2. if you try to call a tools and you don't know the answer please say: "${NO_ANSWER_MESSAGE}"
        `),
        new HumanMessage(q),
    ]
    const bindedToolsLLM = llm.bindTools!([openAISDKChat])
    let executor = await bindedToolsLLM.invoke(messages)

    console.log(executor);
    
    messages.push(executor)
    if(executor.tool_calls){
        console.log(executor.tool_calls);
        
        for (const toolCall of executor.tool_calls) {
            const selectedTool = toolsByName[toolCall.name as keyof typeof toolsByName]
            if (!selectedTool) continue;

            const toolResult = await selectedTool.invoke(toolCall);

            console.log("result");
            console.log("result");
            console.log("result");
            
            console.log(toolResult);
            
            messages.push(new ToolMessage({
                tool_call_id: toolCall.id!,
                name: toolCall.name,
                content: JSON.stringify(toolResult),
            }))
        }

        executor = await bindedToolsLLM.invoke(messages);

        console.log("executor");
        console.log("executor");
        console.log("executor");
        
        console.log(executor);
        
    }

    return executor.content
}