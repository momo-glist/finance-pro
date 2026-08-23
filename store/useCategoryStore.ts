import { convertKeysToCamelCase } from "@/lib/app.helpers";
import { API_URL } from "@/lib/config";
import { create } from "zustand";
import {
    ICategoryInpute,
    ICategoryItem,
    ICategoryStore,
} from "./useTransactionsStore.types";

export const useCategoryStore = create<ICategoryStore>((set, get) => ({
  userCategories: [],

  fetchCategories: async (userId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/category?userId=${userId}`);
      const data = await response.json();
      const parsedData = convertKeysToCamelCase(data.categories);
      set({ userCategories: parsedData });
    } catch (error) {
      console.log("Failed to fetch categories:", error);
    }
  },

  addCategory: async (input: ICategoryInpute) => {
    try {
      const response = await fetch(`${API_URL}/api/category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });
      const data = await response.json();
      const parsedCategory = convertKeysToCamelCase(data.category);
      set((state) => ({
        userCategories: [...state.userCategories, parsedCategory],
      }));
    } catch (error) {
      console.log("Failed to add category:", error);
    }
  },

  getCategoryByName: (name: string) => {
    const { userCategories } = get();
    return userCategories.find((cat) => cat.name === name);
  },
}));
