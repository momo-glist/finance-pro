import {
  date,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  first_name: text("first_name"),
  last_name: text("last_name"),
  currency: text("currency").default("XOF"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const categoryType = pgEnum("category_type", ["income", "expense"]);

export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  user_id: text("user_id").references(() => users.id),
  name: text("name").notNull(),
  type: categoryType("type").notNull(),
  icon: text("icon").notNull(),
  created_date: timestamp("created_date").defaultNow().notNull(),
  updated_date: timestamp("updated_date").defaultNow().notNull(),
});

export const transactionType = pgEnum("transaction_type", [
  "income",
  "expense",
]);

export const transactions = pgTable("transactions", {
  id: text("id").primaryKey(),
  user_id: text("user_id").references(() => users.id),
  title: text("title").notNull(),
  type: transactionType("type").notNull(),
  category: text("category").references(() => categories.name),
  amount: integer("amount").notNull(),
  transaction_date: date("transaction_date").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});
