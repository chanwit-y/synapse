import { openAIChat, openAISDKChat } from "./openai_chat";

export const toolsByName = {
    openai_chat: openAIChat,
    openai_sdk_chat: openAISDKChat,
}