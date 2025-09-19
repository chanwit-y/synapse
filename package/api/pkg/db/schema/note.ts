import { pgTable, varchar, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { categoryTable } from "./category";

export const noteTable = pgTable("note", {
    id: uuid().defaultRandom().primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    categoryId: uuid().references(() => categoryTable.id),
    content: text().notNull(), //full content
    createdBy: varchar({ length: 36 }).notNull(),
    updatedBy: varchar({ length: 36 }).notNull(),
    createdAt: timestamp({ mode: "string", withTimezone: true })
        .notNull()
        .defaultNow(),

    updatedAt: timestamp({ mode: "string", withTimezone: true })
        .notNull()
        .defaultNow(),
});
