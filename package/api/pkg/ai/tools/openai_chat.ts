import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { DynamicTool } from "@langchain/core/tools";
import OpenAI from "openai";

// const webSearchTool = new DynamicTool({
//     name: "web_search",
//     description: "Search the web for up-to-date information",
//     func: async (query: string) => {
//         // Implement the web search using a real API, such as Bing or SerpAPI
//         const apiKey = process.env.WEB_SEARCH_API_KEY;
//         const apiUrl = `https://api.example.com/search?q=${encodeURIComponent(query)}&key=${apiKey}`;

//         try {
//             const response = await fetch(apiUrl);
//             if (!response.ok) {
//                 throw new Error(`Error fetching search results: ${response.statusText}`);
//             }
//             const data = await response.json();
//             return data.results.map(result => result.title).join(', ');
//         } catch (error) {
//             console.error("Error during web search:", error);
//             return "An error occurred while searching the web.";
//         }
//     },
// });


const chatSchema = z.object({
    message: z.string()
})

export const openAIChat = tool(async (input) => {
    const { message } = chatSchema.parse(input)
    const model = new ChatOpenAI({
        model: process.env.OPEN_AI_GPT_5_MODEL!,
        temperature: 1,
    })
    // const modelWithTools = model.bindTools([webSearchTool]);

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
            }
        ]
    })

    console.log(result);
    

    return result.output_text
}, {
    name: "openai_sdk_chat",
    description: "chat with openai sdk",
    schema: chatSchema
})