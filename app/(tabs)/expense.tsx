import { getCategoryWiseData, getTopCategory } from "@/lib/app.helpers";
import { useExpenseStore } from "@/store/useExpensesStore";
import { IExpenseItem } from "@/store/useExpensesStore.types";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import TransactionCard from "../components/ExpenseScreen/TransactionCard";
import SafeAreaView from "../components/SafeAreaView";

const ExpenseScreen = () => {
  const { userExpenses, deleteExpense, fetchExpenses } = useExpenseStore();
  const categoryWiseData = getCategoryWiseData(userExpenses);
  const total = categoryWiseData.reduce((sum, item) => sum + item.value, 0);

  const router = useRouter();

  const handleUpdate = (expense: IExpenseItem) => {
    const { id, title, category, amount, expense_date } = expense || {};

    router.push({
      pathname: "/add",
      params: { id, title, category, amount, expense_date: expense_date || (expense as any).expenseDate },
    });
  };
  const handleDelete = async (id: string) => {
    await deleteExpense(id);
    await fetchExpenses();
  };

  const renderCategoryWiseFunding = () => {
    return (
      <View className="rounded-xl dark:bg-shark bg-white px-6 py-6 gap-6 mt-8">
        <Text className="dark:text-gray-suite text-shark text-xl font-bold">
          Catégorie
        </Text>

        {categoryWiseData.map((item, index) => {
          const percentage = (item.value / total) * 100;
          return (
            <View className="gap-2" key={index}>
              <View className="flex-row jutify-betwenn items-center">
                <Text className="text-base font-semibold dark:text-white w-46">
                  {item.label}
                </Text>
                <Text className="text-base font-semibold dark:text-melrose text-gun-powder ">
                  {item.value}F {percentage.toFixed(0)}%
                </Text>
              </View>

              <View className="w-full h-4.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <View
                  style={{ width: `${percentage}%` }}
                  className="h-full bg-royal-blue rounded-full"
                ></View>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 dark:bg-cinder bg-magnolia">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="rounded-xl bg-melrose/70 dark:bg-shark-2 px-6 py-6">
          <View className="slef-start">
            <Text className="text-white px-3 bg-royal-blue text-base font-medium rounded-full py-1">
              Top Categorie
            </Text>
          </View>
          <View className="mt-4">
            <Text className="dark:text-white text-black text-3xl font-semibold mt-1">
              {getTopCategory(userExpenses).label}
            </Text>
            <Text className="mt-3 dark:text-white text-black">
              Contribue à {""}
              {getTopCategory(userExpenses).percentage.toFixed(2)}% de vos
              dépenses total
            </Text>
            <Text className="text-4xl text-persian-blue dark:text-melrose mt-6 font-bold">
              {getTopCategory(userExpenses).amount.toFixed(2)} F
            </Text>
          </View>
        </View>

        {renderCategoryWiseFunding()}

        <View className="rounded-xl bg-white dark:bg-shark px-6 py-6 gap-6 mt-8">
          <Text className="dark:text-gray-suit text-shark text-xl font-bold">
            Toutes vos transactions
          </Text>
          <View className="gap-10">
            {userExpenses.slice(0, 5).map((expense) => {
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
