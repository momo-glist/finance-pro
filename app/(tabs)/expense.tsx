import { getCategoryWiseData, getTopCategory } from "@/lib/app.helpers";
import { useTransactionStore } from "@/store/useTransactionsStore";
import { ITransactionItem } from "@/store/useTransactionsStore.types";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import TransactionCard from "../components/ExpenseScreen/TransactionCard";
import SafeAreaView from "../components/SafeAreaView";

const ExpenseScreen = () => {
  const { userTransactions, deleteTransaction, fetchTransactions } =
    useTransactionStore();
  const categoryWiseData = getCategoryWiseData(userTransactions);
  const total = categoryWiseData.reduce((sum, item) => sum + item.value, 0);

  const router = useRouter();

  const handleUpdate = (expense: ITransactionItem) => {
    const { id, title, type, category_id, amount, transaction_date } =
      expense || {};

    router.push({
      pathname: "/add",
      params: {
        id,
        title,
        type,
        category_id,
        amount,
        transaction_date: transaction_date || (expense as any).transactionDate,
      },
    });
  };
  const handleDelete = async (id: string) => {
    await deleteTransaction(id);
    await fetchTransactions(id);
  };

  const renderCategoryWiseFunding = () => {
    return (
      <View className="rounded-xl dark:bg-dark-surface bg-surface px-6 py-6 gap-6 mt-8">
        <Text className="dark:text-dark-text-secondary text-text text-xl font-bold">
          Catégorie
        </Text>

        {categoryWiseData.map((item, index) => {
          const percentage = (item.value / total) * 100;
          return (
            <View className="gap-2" key={index}>
              <View className="flex-row jutify-betwenn items-center">
                <Text className="text-base font-semibold dark:text-dark-text w-46">
                  {item.label}
                </Text>
                <Text className="text-base font-semibold dark:text-dark-primary-light text-text-secondary">
                  {item.value}F {percentage.toFixed(0)}%
                </Text>
              </View>

              <View className="w-full h-4.5 bg-surface-secondary dark:bg-dark-surface-secondary rounded-full overflow-hidden">
                <View
                  style={{ width: `${percentage}%` }}
                  className="h-full bg-accent rounded-full"
                ></View>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 dark:bg-dark-background bg-background">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="rounded-xl bg-primary-light/70 dark:bg-dark-surface-secondary px-6 py-6">
          <View className="slef-start">
            <Text className="text-white px-3 bg-accent text-base font-medium rounded-full py-1">
              Top Categorie
            </Text>
          </View>
          <View className="mt-4">
            <Text className="dark:text-dark-text text-text text-3xl font-semibold mt-1">
              {getTopCategory(userTransactions).label}
            </Text>
            <Text className="mt-3 dark:text-dark-text text-text">
              Contribue à {""}
              {getTopCategory(userTransactions).percentage.toFixed(2)}% de vos
              dépenses total
            </Text>
            <Text className="text-4xl text-accent dark:text-dark-primary-light mt-6 font-bold">
              {getTopCategory(userTransactions).amount.toFixed(2)} F
            </Text>
          </View>
        </View>

        {renderCategoryWiseFunding()}

        <View className="rounded-xl bg-surface dark:bg-dark-surface px-6 py-6 gap-6 mt-8">
          <Text className="dark:text-dark-text-secondary text-text text-xl font-bold">
            Toutes vos transactions
          </Text>
          <View className="gap-10">
            {userTransactions.slice(0, 5).map((expense) => {
              return (
                <TransactionCard
                  key={expense.id}
                  expense={expense}
                  handleUpdate={handleUpdate}
                  handleDelete={handleDelete}
                />
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExpenseScreen;
