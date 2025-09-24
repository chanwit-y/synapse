import { integer, pgTable, varchar, text, vector, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";
import { noteTable } from "./note";

export const noteChunkTable = pgTable("note_chunk", {
    id: uuid().defaultRandom().primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    noteId: uuid().references(() => noteTable.id),
    chunkIndex: integer().notNull(),
    language: varchar({ length: 255 }).notNull(),
    content: text().notNull(), //chunk content
    metadata: jsonb().notNull(),
    embedding: vector({ dimensions: 1536 }),
    createdAt: timestamp({ mode: "string", withTimezone: true })
});
