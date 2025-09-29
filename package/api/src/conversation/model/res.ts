import { t } from 'elysia';
import { TResponse } from "../../../model/response"

export const createConversationResponseModel = t.Object({
    conversationId: t.String()
})

export const deleteConversationResponseModel = t.Object({
    success: t.Boolean()
})

export const chatResponseModel = t.Object({
    message: t.String()
})



export type TCreateConversationResponseModel = TResponse<typeof createConversationResponseModel>
export type TDeleteConversationResponseModel = TResponse<typeof deleteConversationResponseModel>
export type TChatResponseModel = TResponse<typeof chatResponseModel>