import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const categoryTable = pgTable("category", {
  id: varchar({ length: 36 }).primaryKey().default('uuid_generate_v4()'),
  name: varchar({ length: 255 }).notNull(),
});
