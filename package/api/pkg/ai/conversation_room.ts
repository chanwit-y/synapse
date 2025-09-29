import { OpenAI } from "openai";
import { TChatModel } from "./model/conversation";
import { ResponseInputContent } from "openai/resources/responses/responses";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export const createChatRoom = async (topic: string): Promise<{ conversationId: string }> => {
    const resp = await client.conversations.create({
        metadata: {
            topic: topic
        },
    })

    return { conversationId: resp.id }
}

export const deleteChatRoom = async (convId: string) => {
    await client.conversations.delete(convId)
}

export const getConversationList = async (convId: string) => {
    const conversation = await client.conversations.items.list(convId)
    return conversation
}

export const openAIChat = async (convId: string, content: TChatModel, instructions: string) => {

    let contentInput: ResponseInputContent = {} as ResponseInputContent

    switch (content.type) {
        case "input_text":
            contentInput = {
                type: content.type,
                text: content.text
            }
            break
        case "input_image":
            contentInput = {
                type: content.type,
                detail: content.detail,
                image_url: content.image_url
            }
            break
        case "input_file":
            contentInput = {
                type: content.type,
                file_url: content.file_url,
                file_data: content.file_data,
                file_id: content.file_id,
                filename: content.filename
            }
            break
    }

    const completion = await client.responses.create({
        model: process.env.OPEN_AI_GPT_4_1_MODEL,
        conversation: convId,
        instructions: instructions,
        tools:[
            {
                type:"web_search",
            }
        ],
        input: [
            {
                type: "message",
                role: "user",
                content: [
                    contentInput
                ]
            }
        ],
    })

    console.log("usage: ", completion.usage);
    console.log("token usage: ", completion.usage?.total_tokens);
    

    return completion.output_text
}
