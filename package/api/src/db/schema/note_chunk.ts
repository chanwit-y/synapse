import { integer, pgTable, varchar, text, vector, timestamp } from "drizzle-orm/pg-core";
import { noteTable } from "./note";

export const noteChunkTable = pgTable("note_chunk", {
    id: varchar({ length: 36 }).primaryKey().default('uuid_generate_v4()'),
    name: varchar({ length: 255 }).notNull(),
    noteId: varchar({ length: 36 }).references(() => noteTable.id),
    chunkIndex: integer().notNull(),
    content: text().notNull(),
    embedding: vector({ dimensions: 1536 }),
    createdAt: timestamp({ mode: "string", withTimezone: true })
});
