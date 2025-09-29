import { Elysia } from "elysia"
import { chat, createConversationRoom, deleteConversationRoom, retrieveConversationList } from "./service"
import { chatModel, createConversationRoomModel, deleteConversationRoomModel, retrieveConversationModel } from "./model/req"

export default new Elysia({
    prefix: "/conversation"
}).post("create-room", async ({ body }) => await createConversationRoom(body), {
    body: createConversationRoomModel
}).post("delete-room", async ({ body }) => await deleteConversationRoom(body), {
    body: deleteConversationRoomModel
}).post("list", async ({ body }) => await retrieveConversationList(body.conversationId), {
    body: retrieveConversationModel
}).post("chat", async ({ body }) => await chat(body), {
    body: chatModel
})