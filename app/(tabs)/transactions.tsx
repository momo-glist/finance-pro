import { getCategoryWiseData } from "@/lib/app.helpers";
import { useTransactionStore } from "@/store/useTransactionsStore";
import { ITransactionItem } from "@/store/useTransactionsStore.types";
import { MAP_CATEGORY_TO_ICON } from "@/utils/constants";
import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";
import Svg, { Circle } from "react-native-svg";
import SafeAreaView from "../components/SafeAreaView";

const ExpenseScreen = () => {
  const { userTransactions, deleteTransaction, fetchTransactions, filter, setFilter } =
    useTransactionStore();
  const { user } = useUser();
  const [showDropdown, setShowDropdown] = React.useState(false);

  const chartColors = [
    "#f75f40",
    "#843bee",
    "#22c55e",
    "#eab308",
    "#3b82f6",
    "#ec4899",
    "#14b8a6",
    "#f97316",
    "#6366f1",
    "#84cc16"
  ];
  
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
  const expenseTransactions = filteredTransactions.filter(t => t.type === "expense");
  const categoryWiseData = getCategoryWiseData(expenseTransactions);
  const total = categoryWiseData.reduce((sum, item) => sum + item.value, 0);

  const router = useRouter();

  const handleUpdate = (expense: ITransactionItem) => {
    const { id, title, type, amount } = expense || {};
    const categoryId = (expense as any).categoryId || expense.category_id;
    const categoryName = (expense as any).categoryName;
    const transactionDate = (expense as any).transactionDate || (expense as any).transaction_date;

    router.push({
      pathname: "/add",
      params: {
        id,
        title,
        type,
        category_id: categoryId,
        category_name: categoryName,
        amount,
        expense_date: transactionDate,
      },
    });
  };
  const handleDelete = async (id: string) => {
    await deleteTransaction(id);
    if (user?.id) {
      await fetchTransactions(user.id);
    }
  };

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
            
            <View className="items-center justify-center py-4">
          <Svg width={250} height={250}>
            {categoryWiseData.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const radius = 100 - (index * 15);
              const circumference = 2 * Math.PI * radius;
              const strokeDashoffset = circumference - (percentage / 100) * circumference;
              const color = chartColors[index % chartColors.length];
              
              return (
                <React.Fragment key={index}>
                  {/* Cercle de fond */}
                  <Circle
                    cx={125}
                    cy={125}
                    r={radius}
                    stroke="#e0e0e0"
                    strokeWidth={12}
                    fill="transparent"
                  />
                  {/* Cercle de progression */}
                  <Circle
                    cx={125}
                    cy={125}
                    r={radius}
                    stroke={color}
                    strokeWidth={12}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    rotation={-90}
                    originX={125}
                    originY={125}
                  />
                </React.Fragment>
              );
            })}
          </Svg>
          <View style={{
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1e1e1e' }}>
              {total}F
            </Text>
          </View>
        </View>
        <View className="gap-2 mt-4">
          {categoryWiseData.map((item, index) => {
            const percentage = (item.value / total) * 100;
            return (
              <View className="flex-row justify-between items-center" key={index}>
                <View className="flex-row items-center gap-2">
                  <View 
                    style={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: 6, 
                      backgroundColor: chartColors[index % chartColors.length] 
                    }} 
                  />
                  <Text className="text-base font-semibold dark:text-dark-text">
                    {item.label}
                  </Text>
                </View>
                <Text className="text-base font-semibold dark:text-dark-primary-light text-text-secondary">
                  {item.value}F ({percentage.toFixed(0)}%)
                </Text>
              </View>
            );
          })}
        </View>

        <View className="gap-4 mt-8">
          <Text className="dark:text-athens-gray text-text text-xl font-bold px-4">
            Toutes vos transactions
          </Text>
          {filteredTransactions
            .filter((expense) => expense && expense.id)
            .map((expense) => {
              const renderRightActions = () => (
                <View className="flex-row">
                  <TouchableOpacity
                    onPress={() => handleUpdate(expense)}
                    className="bg-blue-500 justify-center items-center px-6"
                    style={{ width: 80 }}
                  >
                    <Text className="text-white font-semibold">Modifier</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDelete(expense.id)}
                    className="bg-red-500 justify-center items-center px-6"
                    style={{ width: 80 }}
                  >
                    <Text className="text-white font-semibold">Supprimer</Text>
                  </TouchableOpacity>
                </View>
              );

              return (
                <Swipeable key={expense.id} renderRightActions={renderRightActions}>
                  <View className="rounded-xl bg-surface dark:bg-dark-surface px-4 py-4">
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
                className="text-sm font-medium"
                style={{ color: filter === option ? "#fff" : "#1e1e1e" }}
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
};

export default ExpenseScreen;
