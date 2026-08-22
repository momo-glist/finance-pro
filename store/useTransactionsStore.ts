import { convertKeysToCamelCase } from "@/lib/app.helpers";
import { API_URL } from "@/lib/config";
import { create } from "zustand";
import {
    ITransactionInpute,
    ITransactionStore,
} from "./useTransactionsStore.types";

export const useTransactionStore = create<ITransactionStore>((set, get) => ({
  userTransactions: [],
  filter: "Ce mois",

  setFilter: (filter: string) => {
    set({ filter });
  },

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
      console.log("Updating transaction with data:", { id, title, type, category_id, amount, transactionDate });
      
      const response = await fetch(`${API_URL}/api/transaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          title,
          type,
          category_id,
          amount,
          transaction_date: transactionDate,
        }),
      });

      const text = await response.text();
      console.log("STATUS:", response.status);
      console.log("RESPONSE:", text);

      if (!response.ok) {
        console.error("API error:", text);
        return;
      }

      const data = JSON.parse(text);
      console.log("API response:", data);

      set((stats) => ({
        userTransactions: stats.userTransactions.map((item) =>
          item.id === id
            ? convertKeysToCamelCase(data.updateTransactionItem)
            : item,
        ),
      }));
    } catch (error) {
      console.log("Failed to update transaction:", error);
    }
  },

  deleteTransaction: async (id: string) => {
    try {
      console.log("Deleting transaction with id:", id);
      const response = await fetch(`${API_URL}/api/transaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "delete" }),
      });

      const text = await response.text();
      console.log("DELETE STATUS:", response.status);
      console.log("DELETE RESPONSE:", text);

      if (!response.ok) {
        console.error("DELETE error:", text);
        return;
      }

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
