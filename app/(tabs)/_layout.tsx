import { useTransactionStore } from "@/store/useTransactionsStore";
import { useUserStore } from "@/store/useUser";
import { useAuth, useUser } from "@clerk/expo";
import { Redirect } from "expo-router";
import { NativeTabs } from "expo-router/native-tabs";
import { useEffect } from "react";
import { useColorScheme } from "react-native";

export default function TabsLayout() {
  const { isSignedIn, isLoaded, userId } = useAuth();

  const { user, isLoaded: isUserLoaded } = useUser();

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const tabTintColor = isDark ? "#c5c0ff" : "#584de0";

  const { fetchTransactions } = useTransactionStore();

  const { fetchUser, addUser } = useUserStore();

  useEffect(() => {
    if (!isLoaded || !isUserLoaded || !isSignedIn || !userId || !user) {
      return;
    }

    const syncUser = async () => {
      try {
        const userExists = await fetchUser(userId);

        if (!userExists) {
          const email = user.primaryEmailAddress?.emailAddress;

          if (!email) {
            console.error(
              "Impossible de récupérer l'adresse email depuis Clerk",
            );
            return;
          }

          await addUser({
            id: userId,
            email: email,
            first_name: user.firstName ?? "",
            last_name: user.lastName ?? "",
            currency: "XOF",
          });

          console.log("Utilisateur créé dans Neon");
        }

        await fetchTransactions(userId);
      } catch (error) {
        console.error("Erreur lors de la synchronisation :", error);
      }
    };

    syncUser();
  }, [addUser, fetchTransactions, fetchUser, isLoaded, isUserLoaded, isSignedIn, user, userId]);

  if (!isLoaded || !isUserLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href={"/(auth)/onboarding" as any} />;
  }

  return (
    <NativeTabs tintColor={tabTintColor}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Stats</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{
            default: "chart.bar",
            selected: "chart.bar.fill",
          }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="add">
        <NativeTabs.Trigger.Label>Add</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{
            default: "plus.circle",
            selected: "plus.circle.fill",
          }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="transactions">
        <NativeTabs.Trigger.Label>Transactions</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{
            default: "creditcard",
            selected: "creditcard.fill",
          }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{
            default: "person",
            selected: "person.fill",
          }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
