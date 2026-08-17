import { IExpenseItem } from "@/store/useExpensesStore.types";
import { getFullDate, MAP_CATEGORY_TO_ICON } from "@/utils/constants";
import React from "react";
import { Image, Text, View } from "react-native";

const ExpenseCard = ({ expense }: { expense: IExpenseItem }) => {
  return (
    <View className="flex-row justify-between items-center">
      <View className="flex-row items-start gap-4">
        <View className="dark:bg-shark-3 bg-shark-3/10 p-2 rounded-lg">
          <Image
            source={{ uri: MAP_CATEGORY_TO_ICON[expense.category] }}
            style={{ width: 20, height: 20 }}
          />
        </View>
        <View>
          <Text className="text-base font-semibold dark:text-white w-66">
            {expense.title}
          </Text>
          <Text className="text-gun-powder dark:text-gray-suit">
            {getFullDate(expense)}
          </Text>
          <Text className="text-gun-powder dark:text-gray-suit">
            {expense.category}
          </Text>
        </View>
      </View>
      <Text className="text-base font-semibold dark:text-melrose">
        F{expense.amount}
      </Text>
    </View>
  );
};

export default ExpenseCard;
