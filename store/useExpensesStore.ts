import { convertKeysToCamelCase } from "@/lib/app.helpers";
import { create } from "zustand";
import { IExpenseInpute, IExpenseStore } from "./useExpensesStore.types";

export const useExpenseStore = create<IExpenseStore>((set, get) => ({
  userExpenses: [],

  fetchExpenses: async () => {
    try {
      const response = await fetch("/api/expense");
      const data = await response.json();
      const parsData = convertKeysToCamelCase(data.expenses);

      set({ userExpenses: parsData });
    } catch (error) {
      console.log("Failed to fetch expenses:", error);
    }
  },

  addExpense: async (input: IExpenseInpute) => {
    try {
      const { title, category, amount, expenseDate } = input || {};
      const response = await fetch("/api/expense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          amount,
          expense_date: expenseDate,
        }),
      });

      const data = await response.json();

      set((state) => ({
        userExpenses: [convertKeysToCamelCase(data.createExpenseItem), ...state.userExpenses],
      }));
    } catch (error) {
      console.log("Failed to add expense:", error);
    }
  },

  updateExpense: async (id: string, input: IExpenseInpute) => {
    try {
      const { title, category, amount, expenseDate } = input || {};
      const response = await fetch("/api/expense", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          amount,
          expense_date: expenseDate,
        }),
      });

      const data = await response.json();

      set((stats) => ({
        userExpenses: stats.userExpenses.map((item) =>
          item.id === id ? convertKeysToCamelCase(data.createExpenseItem) : item,
        ),
      }));
    } catch (error) {
      console.log("Failed to update expense:", error);
    }
  },

  deleteExpense: async (id: string) => {
    try {
      await fetch(`/api/expense/${id}`, { method: "DELETE" });
    } catch (error) {
      console.log("Failed to delete expense:", error);
    }
  },
}));
