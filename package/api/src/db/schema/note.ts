import { integer, pgTable, varchar, text, vector, timestamp } from "drizzle-orm/pg-core";
import { categoryTable } from "./category";

export const noteTable = pgTable("note", {
    id: varchar({ length: 36 }).primaryKey().default('uuid_generate_v4()'),
    name: varchar({ length: 255 }).notNull(),
    categoryId: varchar({ length: 36 }).references(() => categoryTable.id),
    content: text().notNull(),
    createdBy: varchar({ length: 36 }).notNull(),
    updatedBy: varchar({ length: 36 }).notNull(),
    createdAt: timestamp({ mode: "string", withTimezone: true })
        .notNull()
        .defaultNow(),

    updatedAt: timestamp({ mode: "string", withTimezone: true })
        .notNull()
        .defaultNow(),
});
