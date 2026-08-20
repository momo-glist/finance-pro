import { API_URL } from "@/lib/config";
import { create } from "zustand";
import { IUserStore } from "./useUser.types";

export const useUserStore = create<IUserStore>((set) => ({
  user: null,

  fetchUser: async (userId: string) => {
    try {
      if (!userId) {
        console.log("No userId provided");
        return false;
      }

      // Vérifier si l'utilisateur existe déjà dans notre DB
      const response = await fetch(
        `${API_URL}/api/user?userId=${userId}`,
      );
      const data = await response.json();

      if (response.ok && data.user) {
        set({ user: data.user });
        return true; // Utilisateur trouvé
      } else if (response.status === 404) {
        // L'utilisateur n'existe pas
        console.log("User not found in database");
        return false; // Utilisateur non trouvé
      }
      return false;
    } catch (error) {
      console.error("Failed to fetch user:", error);
      return false;
    }
  },

  addUser: async (data) => {
    try {
      const response = await fetch(`${API_URL}/api/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Erreur API :", result);
        return false;
      }

      if (result.user) {
        set({ user: result.user });
        return true;
      }

      return false;
    } catch (error) {
      console.error("Failed to add user:", error);
      return false;
    }
  },
}));
