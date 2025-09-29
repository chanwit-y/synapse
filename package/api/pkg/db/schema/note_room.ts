import { integer, pgTable, varchar, text, vector, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";
import { noteTable } from "./note";

export const noteRoomTable = pgTable("note_room", {
    id: uuid().defaultRandom().primaryKey(),
    conversationId: varchar({ length: 255 }).notNull(),
    instruction: text().notNull(),
    noteId: uuid().references(() => noteTable.id),
    createdAt: timestamp({ mode: "string", withTimezone: true })
});
