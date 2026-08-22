import { ITransactionItem } from "@/store/useTransactionsStore.types";
import { MAP_CATEGORY_TO_ICON } from "@/utils/constants";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

const TransactionCard = ({
  expense,
  handleUpdate,
  handleDelete,
}: {
  expense: ITransactionItem;
  handleUpdate: (value: ITransactionItem) => void;
  handleDelete: (id: string) => void;
}) => {
  return (
    <View className="flex-row justify-between items-start overflow-x-scroll">
      <View className="flex-row items-start gap-4">
        <View className="dark:bg-dark-surface-secondary bg-surface-secondary p-2 rounded-lg">
          <Image
            source={{ uri: MAP_CATEGORY_TO_ICON[(expense as any).categoryName || (expense as any).categoryId] }}
            style={{ width: 32, height: 32 }}
          />
        </View>

        <View className="gap-0.5">
          <Text className="text-base font-semibold dark:text-dark-text w-46">
            {expense.title}
          </Text>
          <Text className="text-text-secondary dark:text-dark-text-secondary">
            {(() => {
              const dateStr = (expense as any).transactionDate || expense.transaction_date;
              // Format YYYY-MM-DD to DD/MM/YYYY
              if (dateStr && dateStr.includes('-')) {
                const parts = dateStr.split('-');
                if (parts.length === 3) {
                  return `${parts[2]}/${parts[1]}/${parts[0]}`;
                }
              }
              // Fallback to Date parsing
              const date = new Date(dateStr);
              return isNaN(date.getTime()) ? "Date invalide" : date.toLocaleDateString("fr-FR");
            })()}{" "}
            {","} {(expense as any).categoryName || (expense as any).categoryId}
          </Text>
          <Text className="text-base font-semibold dark:text-dark-primary-light">
            {expense.amount} F
          </Text>
        </View>

        <View className="items-end">
          <View className="flex-row gap-3">
            <Pressable
              onPress={() => handleUpdate(expense)}
              className="p-2 rounded-full bg-success/20 dark:bg-success/40 active:opacity-60"
            >
              <Text className="text-success dark:text-dark-success text-lg">✏️</Text>
            </Pressable>
            <Pressable
              onPress={() => handleDelete(expense.id)}
              className="p-2 rounded-full bg-accent/20 dark:bg-accent/40 active:opacity-60"
            >
              <Text className="text-accent dark:text-dark-accent text-lg">🗑️</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TransactionCard;
