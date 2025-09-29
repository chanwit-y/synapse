import { Static, t } from "elysia";

export const instructions = t.Object({
    instructionId: t.String()
})

export const ChatModel = t.Union([
    t.Object({
        type: t.Literal("input_text"),
        text: t.String()
    }),
    t.Object({
        type: t.Literal("input_image"),
        detail: t.Union([t.Literal("auto"), t.Literal("high"), t.Literal("low")]),
        image_url: t.String()
    }),
    t.Object({
        type: t.Literal("input_file"),
        file_data: t.Optional(t.String()),
        file_id: t.Optional(t.String()),
        file_url: t.Optional(t.String()),
        filename: t.Optional(t.String())
    })
])

export const ChatRequestModel = t.Object({
    conversationId: t.String(),
    instructions: instructions,
    content: ChatModel,
})

export const DeleteRoomModel = t.Object({
    conversationId: t.String(),
    message: t.String()
})


export type TChatModel = Static<typeof ChatModel>
export type TChatRequestModel = Static<typeof ChatRequestModel>
export type TDeleteRoomModel = Static<typeof DeleteRoomModel>
