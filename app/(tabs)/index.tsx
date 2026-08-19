import {
  getcurrentMonthExpense,
  getMonthWiseChartData,
  getTotalExpense,
} from "@/lib/app.helpers";
import { useExpenseStore } from "@/store/useExpensesStore";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import SafeAreaView from "../components/SafeAreaView";
import ExpenseCard from "../components/StatsScreen/ExpenseCard";

export default function HomeScreen() {
  const { userExpenses } = useExpenseStore();
  const [chartData, setChartData] =
    useState<{ label: string; value: number }[]>();

  useEffect(() => {
    const monthData = getMonthWiseChartData(userExpenses);
    setChartData(monthData);
  }, [userExpenses]);

  return (
    <SafeAreaView className="bg-magnolia dark:bg-cinder flex-1">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="dark:bg-shark bg-persian-blue rounded-xl px-6 py-8 gap-1 shadow-xs">
          <Text className="dark:text-gray-suite text-white text-sm font-medium">
            Dépenses
          </Text>
          <Text className="dark:text-melrose text-white font-extrabold text-[3rem]">
            {getTotalExpense(userExpenses).toFixed(2)} F
          </Text>

          <View className="dark:bg-shark-2 bg-royal-blue p-4 rounded-lg gap-1 mt-6 border border-athens-gray/10 shadow">
            <Text className="dark:text-gray-suite text-white text-sm font-medium">
              Dépenses mensuelles
            </Text>
            <Text className="dark:text-athens-gray text-white font-bold text-3xl">
              {getcurrentMonthExpense(userExpenses)} F
            </Text>
          </View>
        </View>

        <View className="mt-8 bg-white dark:bg-shark rounded-xl px-6 py-8 gap-1 shadow-xl">
          <Text className="dark:text-gray-suit text-shark text-xl pb-8 font-medium">
            Allocation
          </Text>
          <BarChart
            data={chartData}
            barWidth={40}
            spacing={40}
            roundedTop
            hideRules
            noOfSections={4}
            maxValue={
              chartData && Math.max(...chartData.map((i) => i.value)) + 500
            }
            yAxisThickness={0}
            xAxisThickness={0}
            frontColor="#6366F1"
            xAxisLabelTextStyle={{ color: "#aaa" }}
            yAxisTextStyle={{ color: "#aaa" }}
          />
        </View>

        <View className="mt-8 rounded-xl bg-whte dark:bg-shark px-6 py-8 gap-6">
          <View className="flex-row justify-between items-center">
            <Text className="dark:text-gray-suit text-shark text-xl font-medium">
              Transactions récentes
            </Text>
            <Pressable onPress={() => router.push("/expense")}>
              <Text className="font-medium dark:text-melrose text-persian-blue">
                Tout voir
              </Text>
            </Pressable>
          </View>
          <View className="gap-10">
            {userExpenses &&
              userExpenses
                .slice(0, 5)
                .map((expense, index) => (
                  <ExpenseCard key={expense.id || index} expense={expense} />
                ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
