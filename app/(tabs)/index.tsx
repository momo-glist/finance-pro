import {
  getCurrentMonthBalance,
  getcurrentMonthExpense,
  getcurrentMonthIncome,
  getIncomeVsExpenseChartData,
} from "@/lib/app.helpers";
import { useTransactionStore } from "@/store/useTransactionsStore";
import { useUser } from "@clerk/expo";
import { router } from "expo-router";
import { ChartNoAxesColumn } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import SafeAreaView from "../components/SafeAreaView";
import ExpenseCard from "../components/StatsScreen/ExpenseCard";

export default function HomeScreen() {
  const { userTransactions } = useTransactionStore();
  const [chartData, setChartData] =
    useState<{ label: string; income: number; expense: number }[]>();

  const { user } = useUser();

  useEffect(() => {
    const monthData = getIncomeVsExpenseChartData(userTransactions);
    setChartData(monthData);
  }, [userTransactions]);

  return (
    <SafeAreaView className="bg-background dark:bg-dark-background flex-1">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="mb-6">
          <Text className="dark:text-dark-text text-text text-sm font-medium">
            Hello, {user?.firstName} {user?.lastName}
          </Text>
        </View>
        <View className="bg-accent rounded-3xl px-6 py-8 gap-1 shadow-xs">
          <Text className="text-white text-sm font-medium">Balance</Text>

          <Text className="text-white font-extrabold text-[3rem]">
            {getCurrentMonthBalance(userTransactions).toFixed(2)} F
          </Text>

          <View className="flex-row mt-6">
            {/* Revenue */}
            <View className="flex-1 gap-1">
              <Text className="text-white text-opacity-80 text-sm font-medium">
                Revenue
              </Text>

              <Text className="text-white font-bold text-2xl">
                {getcurrentMonthIncome(userTransactions).toFixed(2)} F
              </Text>
            </View>

            {/* Dépense */}
            <View className="flex-1 gap-1 items-end">
              <Text className="text-white text-opacity-80 text-sm font-medium">
                Dépense
              </Text>

              <Text className="text-white font-bold text-2xl">
                {getcurrentMonthExpense(userTransactions).toFixed(2)} F
              </Text>
            </View>
          </View>
        </View>

        <View className="mt-8 bg-background dark:bg-dark-background rounded-xl px-6 py-8 gap-1">
          <Text className="dark:text-dark-text-secondary text-text text-xl pb-8 font-medium">
            Allocation
          </Text>
          {!chartData || chartData.length === 0 ? (
            <View className="items-center justify-center py-12">
              <ChartNoAxesColumn size={64} color="#f75f40" strokeWidth={1.5} />
              <Text className="text-text-secondary text-base mt-4">
                Aucune Transaction pour le moment
              </Text>
            </View>
          ) : (
            <BarChart
              data={chartData.flatMap((item) => [
                {
                  value: item.income,
                  label: item.label,
                  frontColor: "#843bee",
                },
                {
                  value: item.expense,
                  label: "",
                  frontColor: "#f75f40",
                },
              ])}
              barWidth={20}
              spacing={10}
              roundedTop
              noOfSections={4}
              maxValue={
                chartData &&
                Math.max(
                  ...chartData.map((i) => Math.max(i.income, i.expense)),
                ) + 500
              }
              yAxisThickness={1}
              xAxisThickness={0}
              yAxisColor="#e0e0e0"
              xAxisLabelTextStyle={{ color: "#aaa" }}
              yAxisTextStyle={{ color: "#aaa" }}
            />
          )}
        </View>

        <View className="mt-8 rounded-xl bg-surface dark:bg-dark-surface px-6 py-8 gap-6">
          <View className="flex-row justify-between items-center">
            <Text className="dark:text-dark-text-secondary text-text text-xl font-medium">
              Transactions récentes
            </Text>
            <Pressable onPress={() => router.push("/transactions")}>
              <Text className="font-medium dark:text-dark-primary-light text-accent">
                Tout voir
              </Text>
            </Pressable>
          </View>
          <View className="gap-10">
            {userTransactions &&
              userTransactions
                .filter((expense) => expense && expense.id)
                .slice(0, 5)
                .map((expense) => (
                  <ExpenseCard key={expense.id} expense={expense} />
                ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
