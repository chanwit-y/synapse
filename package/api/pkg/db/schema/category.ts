import { integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const categoryTable = pgTable("category", {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
});
