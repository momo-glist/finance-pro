import { convertKeysToCamelCase } from "@/lib/app.helpers";
import { create } from "zustand";
import {
    ITransactionInpute,
    ITransactionStore,
} from "./useTransactionsStore.types";

export const useTransactionStore = create<ITransactionStore>((set, get) => ({
  userTransactions: [],

  fetchTransactions: async (userId: string) => {
    try {
      const response = await fetch(`/api/transaction?userId=${userId}`);
      const data = await response.json();
      const parsData = convertKeysToCamelCase(data.transactions);

      set({ userTransactions: parsData });
    } catch (error) {
      console.log("Failed to fetch transactions:", error);
    }
  },

  addTransaction: async (input: ITransactionInpute) => {
    try {
      const { title, type, category_id, amount, transactionDate } = input || {};
      const response = await fetch("/api/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          type,
          category_id,
          amount,
          transaction_date: transactionDate,
        }),
      });

      const data = await response.json();

      set((state) => ({
        userTransactions: [
          convertKeysToCamelCase(data.createTransactionItem),
          ...state.userTransactions,
        ],
      }));
    } catch (error) {
      console.log("Failed to add transaction:", error);
    }
  },

  updateTransaction: async (id: string, input: ITransactionInpute) => {
    try {
      const { title, type, category_id, amount, transactionDate } = input || {};
      const response = await fetch("/api/transaction", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          type,
          category_id,
          amount,
          transaction_date: transactionDate,
        }),
      });

      const data = await response.json();

      set((stats) => ({
        userTransactions: stats.userTransactions.map((item) =>
          item.id === id
            ? convertKeysToCamelCase(data.createTransactionItem)
            : item,
        ),
      }));
    } catch (error) {
      console.log("Failed to update transaction:", error);
    }
  },

  deleteTransaction: async (id: string) => {
    try {
      await fetch(`/api/transaction/${id}`, { method: "DELETE" });
      set((state) => ({
        userTransactions: state.userTransactions.filter(
          (item) => item.id !== id,
        ),
      }));
    } catch (error) {
      console.log("Failed to delete transaction:", error);
    }
  },
}));
