import { Elysia } from "elysia"
import { chat, createConversationRoom, deleteConversationList, deleteConversationListById, deleteConversationRoom, retrieveConversationList } from "./service"
import { chatModel, createConversationRoomModel, deleteAllConversationModel, deleteConversationListByIdModel, deleteConversationRoomModel, retrieveConversationModel } from "./model/req"

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
}).post("delete-all", async ({ body }) => await deleteConversationList(body.conversationId), {
    body: deleteAllConversationModel
}).post("delete-by-id", async ({ body }) => await deleteConversationListById(body), {
    body: deleteConversationListByIdModel
})