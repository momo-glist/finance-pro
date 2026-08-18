import { IExpenseItem } from "@/store/useExpensesStore.types";
import { MAP_CATEGORY_TO_ICON } from "@/utils/constants";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

const TransactionCard = ({
  expense,
  handleUpdate,
  handleDelete,
}: {
  expense: IExpenseItem;
  handleUpdate: (value: IExpenseItem) => void;
  handleDelete: (id: string) => void;
}) => {
  return (
    <View className="flex-row justify-between items-start overflow-x-scroll">
      <View className="flex-row items-start gap-4">
        <View className="dark:bg-shark-3 bg-shark-3/10 p-2 rounded-lg">
          <Image
            source={{ uri: MAP_CATEGORY_TO_ICON[expense.category] }}
            style={{ width: 20, height: 20 }}
          />
        </View>

        <View className="gap-0.5">
          <Text className="text-base font-semibold dark:text-white w-46">
            {expense.title}
          </Text>
          <Text className="text-gun-powder dark:text-gray-suit">
            {new Date(
              (expense as any).expenseDate || expense.expense_date
            ).toLocaleString("fr-FR", {
              month: "long",
            })}{" "}
            {","} {expense.category}
          </Text>
          <Text className="text-base font-semibold dark:text-melrose">
            {expense.amount} F
          </Text>
        </View>

        <View className="items-end">
          <View className="flex-row gap-3">
            <Pressable
              onPress={() => handleUpdate(expense)}
              className="p-2 rounded-full bg-green-100 dark:bg-melrose active:opacity-60"
            >
              <Text className="text-green-800 dark:text-black text-lg">✏️</Text>
            </Pressable>
            <Pressable
              onPress={() => handleDelete(expense.id)}
              className="p-2 rounded-full bg-red-100 dark:bg-red-400 active:opacity-60"
            >
              <Text className="text-red-800 dark:text-black text-lg">🗑️</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TransactionCard;
