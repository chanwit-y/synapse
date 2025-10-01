import { createChatRoom, removeAllConversationList, deleteChatRoom, getConversationList, openAIChat, removeConversationListById } from "../../pkg/ai/conversation_room";
import { and, eq } from "drizzle-orm";
import db from "../../pkg/db/conn";
import { noteTable } from "../../pkg/db/schema/note";
import { noteRoomTable } from "../../pkg/db/schema/note_room";
import { TChatModel, TCreateConversationRoomModel, TDeleteConversationListByIdModel, TDeleteConversationRoomModel } from "./model/req";
import { TChatResponseModel, TCreateConversationResponseModel, TDeleteConversationResponseModel } from "./model/res";

export const createConversationRoom = async (body: TCreateConversationRoomModel): Promise<TCreateConversationResponseModel> => {
    const { topic, instruction, noteId } = body
    const noteExist = await db.select().from(noteTable).where(eq(noteTable.id, noteId)).limit(1)
    if (noteExist.length === 0) {
        return {
            success: false,
            message: "Note not found",
            data: {
                conversationId: ""
            }
        }
    }

    const roomCreated = await db.select().from(noteRoomTable).where(eq(noteRoomTable.noteId, noteId)).limit(1)
    if (roomCreated.length > 0) {
        return {
            success: false,
            message: "Conversation room already created",
            data: {
                conversationId: roomCreated[0].conversationId
            }
        }
    }

    const conversationId = await createChatRoom(topic)
    if (!conversationId) {
        return {
            success: false,
            message: "Conversation room not created",
            data: {
                conversationId: ""
            }
        }
    }
    await db.insert(noteRoomTable).values({
        conversationId: conversationId.conversationId,
        instruction,
        noteId
    })
    return {
        success: true,
        message: "Conversation room created successfully",
        data: {
            conversationId: conversationId.conversationId
        }
    }
}

export const deleteConversationRoom = async (body: TDeleteConversationRoomModel): Promise<TDeleteConversationResponseModel> => {
    const { noteId, conversationId } = body
    const noteExist = await db.select().from(noteTable).where(eq(noteTable.id, noteId)).limit(1)
    if (!noteExist) {
        return {
            success: false,
            message: "Note not found",
            data: {
                success: false
            }
        }
    }

    const roomExist = await db.select().from(noteRoomTable).where(eq(noteRoomTable.noteId, noteId)).limit(1)
    if (!roomExist) {
        return {
            success: false,
            message: "Conversation room not found",
            data: {
                success: false
            }
        }
    }

    await db.delete(noteRoomTable).where(eq(noteRoomTable.noteId, noteId))
    await deleteChatRoom(conversationId)
    return {
        success: true,
        message: "Conversation room deleted successfully",
        data: {
            success: true
        }
    }
}

export const retrieveConversationList = async (conversationId: string) => {
    const conversation = await getConversationList(conversationId)
    return {
        success: true,
        message: "Conversation retrieved successfully",
        data: {
            conversation: conversation
        }
    }
}

export const chat = async (body: TChatModel): Promise<TChatResponseModel> => {
    const { conversationId, message, noteId } = body
    const noteExist = await db.select().from(noteTable).where(eq(noteTable.id, noteId)).limit(1)
    if (noteExist.length === 0) {
        return {
            success: false,
            message: "Note not found",
            data: {
                message: ""
            }
        }
    }
    const conversation = await db.select().from(noteRoomTable).where(and(eq(noteRoomTable.conversationId, conversationId), eq(noteRoomTable.noteId, noteId))).limit(1)
    if (conversation.length === 0) {
        return {
            success: false,
            message: "Conversation not found",
            data: {
                message: ""
            }
        }
    }

    const { instruction } = conversation[0]
    const response = await openAIChat(conversationId, message, instruction)

    console.log(response);
    return {
        success: true,
        message: "Conversation chat successfully",
        data: {
            message: response
        }
    }
}

export const deleteConversationList = async (conversationId: string) => {
    await removeAllConversationList(conversationId)
    return {
        success: true,
        message: "Conversation deleted successfully",
        data: {
            success: true
        }
    }
}

export const deleteConversationListById = async (body: TDeleteConversationListByIdModel) => {
    const { conversationId, itemId } = body
    await removeConversationListById(conversationId, itemId)
    return {
        success: true,
        message: "Conversation deleted successfully",
        data: {
            success: true
        }
    }
}