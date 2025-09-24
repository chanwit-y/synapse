import { CustomGeminiEmbeddings } from "../../pkg/ai/embedding";
import { extendNoteByGemini } from "../../pkg/ai/extend_note";
import { aiMapping } from "../../pkg/ai/mapping";
import { buildVectorData } from "../../pkg/ai/rag";
import { askAI } from "../../pkg/ai/retreiver";
import db from "../../pkg/db/conn";
import { noteTable } from "../../pkg/db/schema/note";
import { noteChunkTable } from "../../pkg/db/schema/note_chunk";
import { findCategoryById } from "../category/service";
import { TaskAI, CUNote } from "./model/req";

export const createNote = async (body: CUNote) => {
    const category = await findCategoryById(body.categoryId)
    if (!category.success) {
        return category
    }


    if(body.extendNote) {
        const extendedNote = await extendNoteByGemini(body.content)
        if(!extendedNote) {
            return {
                success: false,
                message: "Failed to extend note"
            }
        }
        body.content = `${body.content}\n\n${extendedNote.content}`
    }

    const [newNote] = await db.insert(noteTable).values({
        name: body.name,
        categoryId: body.categoryId,
        language: body.language,
        content: body.content,
        createdBy: "SYSTEM",
        updatedBy: "SYSTEM",
    }).returning()

    const embeddings = new CustomGeminiEmbeddings(process.env.GEMINI_EMBEDING_001_MODEL!)
    const {vectors, chunks} = await buildVectorData(body.content, embeddings)

    const datas: typeof noteChunkTable.$inferInsert[] = []

    for (let i = 0; i < vectors.length; i++) {
        datas.push({
            noteId: newNote.id,
            chunkIndex: i,
            content: chunks[i],
            language: body.language,
            metadata: {
                source: "manual",
            },
            embedding: vectors[i],
            name: body.name,
        })
    }

    await db.insert(noteChunkTable).values(datas)

    return {
        success: true,
        message: "Note created successfully",
        data: newNote
    }
}

export const ask = async (body: TaskAI) => {
    const {retreiver, llm} = await aiMapping[body.aiProvider as keyof typeof aiMapping](body.model, body.topic, 5)

    const result = await askAI({q: body.question, retreiver, llm})
    
    return {
        success: true,
        message: "AI task completed successfully",
        data: result
    }
}