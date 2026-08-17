import { date, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const expenses = pgTable("expenses", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  amount: integer("amount").notNull(),
  expense_date: date("expense_date").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});
