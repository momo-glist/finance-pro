import {
    getCurrentMonthBalance,
    getcurrentMonthExpense,
    getcurrentMonthIncome,
    getDailyChartData,
    getFilteredBalance,
    getFilteredExpense,
    getFilteredIncome,
    getIncomeVsExpenseChartData,
} from "@/lib/app.helpers";
import { useTransactionStore } from "@/store/useTransactionsStore";
import { ITransactionItem } from "@/store/useTransactionsStore.types";
import { MAP_CATEGORY_TO_ICON } from "@/utils/constants";
import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ChartNoAxesColumn } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";
import { BarChart } from "react-native-gifted-charts";
import SafeAreaView from "../components/SafeAreaView";

export default function HomeScreen() {
  const { userTransactions, deleteTransaction, fetchTransactions, filter, setFilter } = useTransactionStore();
  const [chartData, setChartData] =
    useState<{ label: string; income: number; expense: number }[]>();
  const [showDropdown, setShowDropdown] = useState(false);

  const { user } = useUser();

  const handleDelete = async (id: string) => {
    await deleteTransaction(id);
    if (user?.id) {
      await fetchTransactions(user.id);
    }
  };

  const handleUpdate = (expense: ITransactionItem) => {
    router.push({
      pathname: "/(tabs)/add",
      params: {
        id: expense.id,
        title: expense.title,
        type: expense.type,
        category_id: expense.category_id,
        category_name: (expense as any).categoryName,
        amount: expense.amount.toString(),
        expense_date: (expense as any).transactionDate || expense.transaction_date,
      },
    });
  };

  const filterTransactions = (transactions: ITransactionItem[]) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return transactions.filter((t) => {
      if (!t) return false;
      const dateStr = (t as any).transactionDate || t.transaction_date;
      if (!dateStr) return false;
      
      const date = new Date(dateStr);
      
      switch (filter) {
        case "Ce mois":
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        case "Cette année":
          return date.getFullYear() === currentYear;
        case "3 derniers mois":
          const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);
          return date >= threeMonthsAgo && date <= now;
        default:
          return true;
      }
    });
  };
  
  const filteredTransactions = filterTransactions(userTransactions);

  useEffect(() => {
    if (filter === "Ce mois") {
      const dailyData = getDailyChartData(filteredTransactions);
      setChartData(dailyData);
    } else {
      const monthData = getIncomeVsExpenseChartData(filteredTransactions);
      setChartData(monthData);
    }
  }, [filteredTransactions, filter]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="bg-background dark:bg-cinder flex-1">
        <View style={{ position: 'relative' }}>
          <ScrollView contentContainerStyle={{ padding: 16 }}>
            <View className="flex-row justify-between items-center mb-6">
              <Text className="dark:text-athens-gray text-text text-sm font-medium">
                Hello, {user?.firstName} {user?.lastName}
              </Text>
              <TouchableOpacity
                onPress={() => setShowDropdown(!showDropdown)}
                className="flex-row items-center gap-2 bg-surface dark:bg-dark-surface px-4 py-2 rounded-lg"
              >
                <Text className="dark:text-athens-gray text-text text-sm font-medium">
                  {filter}
                </Text>
                <Ionicons name={showDropdown ? "chevron-up" : "chevron-down"} size={16} color="#1e1e1e" />
              </TouchableOpacity>
            </View>
        <View className="bg-accent rounded-3xl px-6 py-8 gap-1 shadow-xs">
          <Text className="text-white text-sm font-medium">Balance</Text>

          <Text className="text-white font-extrabold text-[3rem]">
            {filter === "Ce mois" 
              ? getCurrentMonthBalance(filteredTransactions).toFixed(2) 
              : getFilteredBalance(filteredTransactions).toFixed(2)} F
          </Text>

          <View className="flex-row mt-6">
            {/* Revenue */}
            <View className="flex-1 gap-1">
              <Text className="text-white text-opacity-80 text-sm font-medium">
                Revenue
              </Text>

              <Text className="text-white font-bold text-2xl">
                {filter === "Ce mois" 
                  ? getcurrentMonthIncome(filteredTransactions).toFixed(2) 
                  : getFilteredIncome(filteredTransactions).toFixed(2)} F
              </Text>
            </View>

            {/* Dépense */}
            <View className="flex-1 gap-1 items-end">
              <Text className="text-white text-opacity-80 text-sm font-medium">
                Dépense
              </Text>

              <Text className="text-white font-bold text-2xl">
                {filter === "Ce mois" 
                  ? getcurrentMonthExpense(filteredTransactions).toFixed(2) 
                  : getFilteredExpense(filteredTransactions).toFixed(2)} F
              </Text>
            </View>
          </View>
        </View>

        <View className="mt-8 bg-background dark:bg-cinder rounded-xl px-6 py-8 gap-1">
          <Text className="dark:text-athens-gray/80 text-text text-xl pb-8 font-medium">
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

        <View className="gap-4 mt-8">
          <Text className="dark:text-athens-gray/80 text-text text-xl font-bold px-4">
            Transactions récentes
          </Text>
          {filteredTransactions
            .filter((expense) => expense && expense.id)
            .slice(0, 5)
            .map((expense) => {
              const renderRightActions = () => (
                <View className="flex-row">
                  <TouchableOpacity
                    onPress={() => handleUpdate(expense)}
                    className="bg-blue-500 justify-center items-center px-6"
                  >
                    <Ionicons name="create" size={24} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDelete(expense.id)}
                    className="bg-red-500 justify-center items-center px-6"
                  >
                    <Ionicons name="trash" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              );

              return (
                <Swipeable key={expense.id} renderRightActions={renderRightActions}>
                  <View
                    className="rounded-xl bg-surface dark:bg-dark-surface px-4 py-4"
                  >
                    <View className="flex-row justify-between items-center">
                      <View className="flex-row items-center gap-3 flex-1">
                        <Image
                          source={{ uri: MAP_CATEGORY_TO_ICON[(expense as any).categoryName || (expense as any).categoryId] }}
                          style={{ width: 40, height: 40 }}
                          resizeMode="contain"
                        />
                        <View className="flex-1">
                          <Text className="dark:text-athens-gray text-text font-semibold text-lg">
                            {expense.title}
                          </Text>
                          <Text className="dark:text-athens-gray/80 text-text-secondary text-sm mt-1">
                            {(expense as any).categoryName || expense.category_id}
                          </Text>
                          <Text className="dark:text-athens-gray/80 text-text-secondary text-sm mt-1">
                            {(expense as any).transactionDate || expense.transaction_date}
                          </Text>
                        </View>
                      </View>
                      <View className="flex-row items-center gap-2">
                        <Text 
                          className="font-bold text-lg"
                          style={{ color: expense.type === "income" ? "#22c55e" : "#ef4444" }}
                        >
                          {expense.type === "income" ? "+" : "-"}{expense.amount}F
                        </Text>
                        <Ionicons name="chevron-forward" size={24} color="#1e1e1e" />
                      </View>
                    </View>
                  </View>
                </Swipeable>
              );
            })}
        </View>
      </ScrollView>
      </View>
      
      {showDropdown && (
        <View 
          className="bg-surface dark:bg-dark-surface rounded-lg p-2 shadow-lg"
          style={{ 
            position: 'absolute',
            right: 16,
            top: 50,
            width: 150,
            zIndex: 1000
          }}
        >
          {["Ce mois", "3 derniers mois", "Cette année"].map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => {
                setFilter(option);
                setShowDropdown(false);
              }}
              className="py-2 px-4 rounded-lg"
              style={{ backgroundColor: filter === option ? "#f75f40" : "transparent" }}
            >
              <Text 
                className={`text-sm font-medium ${filter === option ? "text-white" : "dark:text-athens-gray text-text"}`}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </SafeAreaView>
    </GestureHandlerRootView>
  );
}
