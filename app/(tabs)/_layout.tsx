import { useTransactionStore } from "@/store/useTransactionsStore";
import { useUserStore } from "@/store/useUser";
import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { useEffect } from "react";
import { useColorScheme } from "react-native";

export default function TabsLayout() {
  const { isSignedIn, isLoaded, userId } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const tabTintColor = isDark ? "#c5c0ff" : "#584de0";
  const { fetchTransactions } = useTransactionStore();
  const { fetchUser } = useUserStore();

  useEffect(() => {
    if (isSignedIn && userId) {
      fetchUser(userId);
      fetchTransactions(userId);
    }
  }, [isSignedIn, userId]);

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href={"/(auth)/onboarding" as any} />;
  }

  return (
    <NativeTabs tintColor={tabTintColor}>
      <NativeTabs.Trigger name="index">
        <Label>Stats</Label>
        <Icon sf={{ default: "chart.bar", selected: "chart.bar.fill" }} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="add">
        <Label>Add</Label>
        <Icon sf={{ default: "plus.circle", selected: "plus.circle.fill" }} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="expense">
        <Label>Expenses</Label>
        <Icon sf={{ default: "creditcard", selected: "creditcard.fill" }} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <Label>Profile</Label>
        <Icon sf={{ default: "person", selected: "person.fill" }} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
