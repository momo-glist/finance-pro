import { ITransactionItem } from "@/store/useTransactionsStore.types";
import { getFullDate, MAP_CATEGORY_TO_ICON } from "@/utils/constants";
import React from "react";
import { Image, Text, View } from "react-native";

const ExpenseCard = ({ expense }: { expense: ITransactionItem }) => {
  return (
    <View className="flex-row justify-between items-center">
      <View className="flex-row items-start gap-4">
        <View className="dark:bg-dark-surface-secondary bg-surface-secondary p-2 rounded-lg">
          <Image
            source={{ uri: MAP_CATEGORY_TO_ICON[(expense as any).categoryName || expense.category_id] }}
            style={{ width: 32, height: 32 }}
          />
        </View>
        <View>
          <Text className="text-base font-semibold dark:text-dark-text w-66">
            {expense.title}
          </Text>
          <Text className="text-text-secondary dark:text-dark-text-secondary">
            {getFullDate(expense)}
          </Text>
          <Text className="text-text-secondary dark:text-dark-text-secondary">
            {(expense as any).categoryName || expense.category_id}
          </Text>
        </View>
      </View>
      <Text className="text-base font-semibold dark:text-dark-primary-light">
        {expense.amount} F
      </Text>
    </View>
  );
};

export default ExpenseCard;
