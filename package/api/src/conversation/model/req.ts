import { Static, t } from "elysia"
import { ChatModel } from "../../../pkg/ai/model/conversation"

export const createConversationRoomModel = t.Object({
    topic: t.String(),
    instruction: t.String(),
    noteId: t.String({format:'uuid'})
})

export const deleteConversationRoomModel = t.Object({
    noteId: t.String({format:'uuid'}),
    conversationId: t.String()
})

export const chatModel = t.Object({
    noteId: t.String({format:'uuid'}),
    conversationId: t.String(),
    message: ChatModel
})

export const retrieveConversationModel = t.Object({
    conversationId: t.String()
})

export type TCreateConversationRoomModel = Static<typeof createConversationRoomModel>
export type TDeleteConversationRoomModel = Static<typeof deleteConversationRoomModel>
export type TChatModel = Static<typeof chatModel>
export type TRetrieveConversationModel = Static<typeof retrieveConversationModel>
