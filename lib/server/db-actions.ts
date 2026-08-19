import { and, desc, eq } from "drizzle-orm";
import { db } from "./db/client";
import { categories, transactions, users } from "./db/schema";

export const createUser = async (data: {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  currency: string;
}) => {
  const [user] = await db
    .insert(users)
    .values({
      id: data.id,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      currency: data.currency,
    })
    .returning();

  return user;
};

export const getUser = async (userId: string) => {
  const [user] = await db.select().from(users).where(eq(users.id, userId));

  return user;
};

export const getCategories = async (userId: string) => {
  const rows = await db
    .select()
    .from(categories)
    .where(eq(categories.user_id, userId))
    .orderBy(desc(categories.created_date));
  
  return rows;
};

export const createCategory = async (data: {
  userId: string;
  name: string;
  type: "income" | "expense";
  icon: string;
}) => {
  const [category] = await db
    .insert(categories)
    .values({
      id: crypto.randomUUID(),
      user_id: data.userId,
      name: data.name,
      type: data.type,
      icon: data.icon,
    })
    .returning();

  return category;
};

export const getAllTransactions = async (userId: string) => {
  const rows = await db
    .select()
    .from(transactions)
    .where(eq(transactions.user_id, userId))
    .orderBy(desc(transactions.transaction_date));

  return rows;
};

export const createTransaction = async (data: {
  userId: string;
  title: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  transaction_date: string;
  categoryIcon?: string;
}) => {
  // Vérifier si la catégorie existe déjà pour cet utilisateur
  const existingCategory = await db
    .select()
    .from(categories)
    .where(and(eq(categories.name, data.category), eq(categories.user_id, data.userId)))
    .limit(1);

  // Si la catégorie n'existe pas, la créer automatiquement
  if (!existingCategory || existingCategory.length === 0) {
    const defaultIcon = data.categoryIcon || (data.type === "income" ? "trending-up" : "trending-down");
    await db.insert(categories).values({
      id: crypto.randomUUID(),
      user_id: data.userId,
      name: data.category,
      type: data.type,
      icon: defaultIcon,
    });
  }

  const [transaction] = await db
    .insert(transactions)
    .values({
      id: crypto.randomUUID(),
      user_id: data.userId,
      title: data.title,
      type: data.type,
      category: data.category,
      amount: data.amount,
      transaction_date: data.transaction_date,
    })
    .returning();

  return transaction;
};

export const updateTransaction = async (
  id: string,
  data: {
    title?: string;
    type?: "income" | "expense";
    category?: string;
    amount?: number;
    transaction_date?: string;
  },
) => {
  const [transaction] = await db
    .update(transactions)
    .set({
      ...data,
      updated_at: new Date(),
    })
    .where(eq(transactions.id, id))
    .returning();

  return transaction;
};

export const deleteTransaction = async (id: string) => {
  const [transaction] = await db
    .delete(transactions)
    .where(eq(transactions.id, id))
    .returning();

  return transaction;
};

export const gettransactionById = async (id: string) => {
  const [transaction] = await db
    .select()
    .from(transactions)
    .where(eq(transactions.id, id));

  return transaction;
};
