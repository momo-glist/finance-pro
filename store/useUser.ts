import { createUser, getUser } from "@/lib/server/db-actions";
import { create } from "zustand";
import { IUserStore } from "./useUser.types";

export const useUserStore = create<IUserStore>((set) => ({
  user: null,

  fetchUser: async (clerkUser) => {
    try {
      if (!clerkUser || !clerkUser.id) {
        console.log("No clerk user provided");
        return;
      }

      // Vérifier si l'utilisateur existe déjà dans notre DB
      const existingUser = await getUser(clerkUser.id);
      
      if (existingUser) {
        set({ user: existingUser });
      } else {
        // Créer l'utilisateur s'il n'existe pas
        const newUser = await createUser({
          id: clerkUser.id,
          email: clerkUser.email || "",
          first_name: clerkUser.firstName || "",
          last_name: clerkUser.lastName || "",
          currency: "XOF",
        });
        set({ user: newUser });
      }
    } catch (error) {
      console.error("Failed to fetch/create user:", error);
    }
  },

  addUser: async (data) => {
    try {
      // Cette méthode peut être utilisée pour mettre à jour l'utilisateur
      const updatedUser = { ...data } as any;
      set({ user: updatedUser });
    } catch (error) {
      console.error("Failed to add user:", error);
    }
  },
}));
