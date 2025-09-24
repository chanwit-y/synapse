import { Static, t } from 'elysia';

export const CUNoteSchema = t.Object({
    name: t.String(),
    categoryId: t.String(),
    content: t.String(),
    language: t.Union([t.Literal("TH"), t.Literal("EN")]),
})

export const askAISchema = t.Object({
    question: t.String(),
    aiProvider: t.Union([t.Literal("gemini"), t.Literal("openai")]),
    model: t.String(),
    topic: t.Union([t.Literal("note")]),
})

export type CUNote = Static<typeof CUNoteSchema>

export type TaskAI = Static<typeof askAISchema>