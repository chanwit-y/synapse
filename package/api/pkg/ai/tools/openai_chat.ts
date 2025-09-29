import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import OpenAI from "openai";

const chatSchema = z.object({
    message: z.string()
})

export const openAIChat = tool(async (input) => {
    const { message } = chatSchema.parse(input)
    const model = new ChatOpenAI({
        model: process.env.OPEN_AI_GPT_5_MODEL!,
        temperature: 1,
    })

    const result = await model.invoke([
        new SystemMessage(`You are a helpful assistant. Just answer directly, do not ask back anything. I will let you to fetch answer from internet (base on current date ${new Date().toLocaleDateString()}) or base knowledge.`),
        new HumanMessage(message)
    ])

    return result.content as string
}, {
    name: "openai_chat",
    description: "chat with openai",
    schema: chatSchema
})

export const openAISDKChat = tool(async (input) => {
    const { message } = chatSchema.parse(input)
    const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    })

    const result = await client.responses.create({
        model: "gpt-4.1",
        instructions: `You are a helpful assistant. Just answer directly, do not ask back anything. I will let you to fetch answer from internet (base on current date ${new Date().toLocaleDateString()}) or base knowledge.`,
        input: [
            {
                type:"message",
                role:"user",
                content: message
            }
        ],
        tools: [
            {
                type: "web_search"
            },
        ]
    })

    console.log(result);
    

    return result.output_text
}, {
    name: "openai_sdk_chat",
    description: "chat with openai sdk",
    schema: chatSchema
})