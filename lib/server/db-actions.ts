import { desc, eq } from "drizzle-orm";
import { db } from "./db/client";
import { expenses } from "./db/schema";

export const getAllExpense = async () => {
  const rows = await db
    .select()
    .from(expenses)
    .orderBy(desc(expenses.expense_date));

  return rows;
};

export const createExpense = async (data: {
  title: string;
  category: string;
  amount: number;
  expense_date: string;
}) => {
  const [expense] = await db
    .insert(expenses)
    .values({
      id: crypto.randomUUID(),
      title: data.title,
      category: data.category,
      amount: data.amount,
      expense_date: data.expense_date,
    })
    .returning();

  return expense;
};

export const updateExpense = async (
  id: string,
  data: {
    title?: string;
    category?: string;
    amount?: number;
    expense_date?: string;
  },
) => {
  const [expense] = await db
    .update(expenses)
    .set({
      ...data,
      updated_at: new Date(),
    })
    .where(eq(expenses.id, id))
    .returning();

  return expense;
};

export const deleteExpense = async (id: string) => {
  const [expense] = await db
    .delete(expenses)
    .where(eq(expenses.id, id))
    .returning();

  return expense;
};

export const getExpenseById = async (id: string) => {
  const [expense] = await db.select().from(expenses).where(eq(expenses.id, id));

  return expense;
};
