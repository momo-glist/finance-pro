import { convertKeysToCamelCase } from "@/lib/app.helpers";
import { API_URL } from "@/lib/config";
import { create } from "zustand";
import {
    ITransactionInpute,
    ITransactionStore,
} from "./useTransactionsStore.types";

export const useTransactionStore = create<ITransactionStore>((set, get) => ({
  userTransactions: [],

  fetchTransactions: async (userId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/transaction?userId=${userId}`);
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
      const userId = (input as any).user_id;
      
      console.log("Creating transaction with data:", { title, type, category_id, amount, transactionDate, userId });
      
      const response = await fetch(`${API_URL}/api/transaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          type,
          category_id,
          amount,
          transaction_date: transactionDate,
          userId,
        }),
      });

      const data = await response.json();
      console.log("API response:", data);

      if (!response.ok) {
        console.error("API error:", data);
        return;
      }

      // Refresh transactions after creation
      if (userId) {
        await get().fetchTransactions(userId);
      }
    } catch (error) {
      console.log("Failed to add transaction:", error);
    }
  },

  updateTransaction: async (id: string, input: ITransactionInpute) => {
    try {
      const { title, type, category_id, amount, transactionDate } = input || {};
      const response = await fetch(`${API_URL}/api/transaction`, {
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
      await fetch(`${API_URL}/api/transaction/${id}`, { method: "DELETE" });
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
