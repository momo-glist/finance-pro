import { useTransactionStore } from "@/store/useTransactionsStore";
import { ITransactionType } from "@/store/useTransactionsStore.types";
import { CATEGORY_KEY, MAP_CATEGORY_TO_ICON } from "@/utils/constants";
import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import SafeAreaView from "../components/SafeAreaView";

const AddScreen = () => {
  const { user } = useUser();
  const {
    id: paramsId,
    title: paramsTitle,
    type,
    category_id,
    amount: paramsAmount,
    expense_date,
  } = useLocalSearchParams<{
    id: string;
    title: string;
    type: ITransactionType;
    amount: string;
    expense_date: string;
    category_id: string;
  }>();

  const [amount, setAmount] = useState<string>(paramsAmount || "");
  const [title, setTitle] = useState(paramsTitle || "");
  const [selectedType, setSelectedType] = useState<ITransactionType | string>(
    type || "",
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(
    category_id || "",
  );
  const [date, setDate] = useState<Date>(
    expense_date ? new Date(expense_date) : new Date(),
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { addTransaction, updateTransaction } = useTransactionStore();
  const [loading, setLoading] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const formatDateForAPI = (inputDate: Date) => {
    if (!inputDate) return "";
    const year = inputDate.getFullYear();
    const month = String(inputDate.getMonth() + 1).padStart(2, "0");
    const day = String(inputDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatDateForDisplay = (inputDate: Date) => {
    if (!inputDate) return "";
    const day = String(inputDate.getDate()).padStart(2, "0");
    const month = String(inputDate.getMonth() + 1).padStart(2, "0");
    const year = inputDate.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const parseDateFromAPI = (inputDate: string) => {
    if (!inputDate) return new Date();
    const parts = inputDate.split("-");
    if (parts.length === 3) {
      return new Date(
        parseInt(parts[2]),
        parseInt(parts[1]) - 1,
        parseInt(parts[0]),
      );
    }
    return new Date();
  };

  const handleAddExpense = async () => {
    if (!title || !selectedType || !selectedCategory || !amount || !date) {
      Alert.alert("Erreur", "Sil vous plait renseigner tout le temps");
      return;
    }

    if (paramsId) {
      handleUpdateExpense();
      return;
    }

    setLoading(true);

    await addTransaction({
      title,
      type: selectedType as ITransactionType,
      category_id: selectedCategory as string,
      amount: Number(amount),
      transactionDate: formatDateForAPI(date),
      user_id: user?.id,
    } as any);

    setLoading(false);

    const message =
      selectedType === "expense"
        ? "Votre dépense a été ajoutée"
        : "Votre revenu a été ajoutée";

    Alert.alert("Bravo", message, [
      {
        text: "Ajouter une autre",
        style: "cancel",
        onPress: () => setTimeout(() => router.replace("/transactions"), 100),
      },
      {
        text: "Voir tout",
        onPress: () => setTimeout(() => router.replace("/transactions"), 100),
      },
    ]);

    setAmount("");
    setTitle("");
    setSelectedType("");
    setSelectedCategory("");
    setDate(new Date());
  };

  const handleUpdateExpense = async () => {
    setLoading(true);

    await updateTransaction(paramsId, {
      title,
      type: selectedType as ITransactionType,
      category_id: selectedCategory as string,
      amount: Number(amount),
      transactionDate: formatDateForAPI(date),
    });

    const message =
      selectedType === "expense"
        ? "Votre dépense a été modifiée"
        : "Votre revenu a été modifié";

    Alert.alert("Bravo", message, [
      {
        text: "Ajouter une autre",
        style: "cancel",
        onPress: () => setTimeout(() => router.replace("/transactions"), 100),
      },
      {
        text: "Voir tout",
        onPress: () => setTimeout(() => router.replace("/transactions"), 100),
      },
    ]);

    setAmount("");
    setTitle("");
    setSelectedCategory("");
    setDate(new Date());
  };

  useEffect(() => {
    setTitle(paramsTitle);
    setSelectedType(type);
    setSelectedCategory(category_id);
    setAmount(paramsAmount);
    if (expense_date) {
      setDate(parseDateFromAPI(expense_date));
    }
  }, [paramsTitle, type, paramsAmount, category_id, expense_date]);

  return (
    <SafeAreaView className="flex-1 dark:bg-dark-background bg-background">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="items-start mt-5">
          <Text className="dark:text-dark-text-secondary text-text-secondary font-semibold text-xl">
            Ajouté une transaction
          </Text>
        </View>
        <View className="flex-row justify-center mt-4 gap-4">
          <Pressable
            className={`w-[45%] items-center justify-center py-4 rounded-3xl gap-2 ${
              selectedType === "income" ? "bg-primary" : "bg-primary/20"
            }`}
            onPress={() => setSelectedType("income")}
          >
            <Ionicons
              name="arrow-up"
              size={24}
              color={selectedType === "income" ? "#fff" : "#843bee"}
            />
            <Text
              className={`font-medium ${
                selectedType === "income" ? "text-white" : "text-primary"
              }`}
            >
              Ajouté un revenu
            </Text>
          </Pressable>
          <Pressable
            className={`w-[45%] items-center justify-center py-4 rounded-3xl gap-2 ${
              selectedType === "expense" ? "bg-accent" : "bg-accent/20"
            }`}
            onPress={() => setSelectedType("expense")}
          >
            <Ionicons
              name="arrow-down"
              size={24}
              color={selectedType === "expense" ? "#fff" : "#f75f40"}
            />
            <Text
              className={`font-medium ${
                selectedType === "expense" ? "text-white" : "text-accent"
              }`}
            >
              Ajouté une dépense
            </Text>
          </Pressable>
        </View>
        <View className="items-center justify-center mt-5">
          <Text className="dark:text-dark-text-secondary text-text-secondary font-semibold text-sm">
            ENTRÉ LE MONTANT
          </Text>
          <View className="flex-row items-center mt-4 w-full">
            <TextInput
              className="h-[4.3rem] flex-1 p-4 text-[1.6rem] font-bold dark:bg-dark-surface bg-surface rounded-xl text-text dark:text-dark-text"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#aaa"
            />
            <Text className="ml-4 text-[1.6rem] font-bold dark:text-dark-text text-accent">
              F
            </Text>
          </View>
        </View>

        <View className="gap-2 mt-4">
          <Text className="dark:text-dark-text-secondary text-text-secondary font-semibold text-sm">
            TITRE
          </Text>
          <TextInput
            className="h-[4.3rem] p-4 text-[1.6rem] font-bold dark:bg-dark-surface bg-surface 
            rounded-xl text-text dark:text-dark-text"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View className="mt-2 gap-4">
          <Text className="dark:text-dark-text-secondary text-text-secondary font-semibold text-sm">
            CATEGORIE
          </Text>
          <Pressable
            className="h-[4.3rem] flex-row items-center px-4 dark:bg-dark-surface bg-surface rounded-xl"
            onPress={() => setShowCategoryModal(true)}
          >
            {selectedCategory ? (
              <>
                <Image
                  source={{ uri: MAP_CATEGORY_TO_ICON[selectedCategory] }}
                  style={{ width: 24, height: 24 }}
                />
                <Text className="ml-3 text-[1.6rem] font-bold text-text dark:text-dark-text">
                  {selectedCategory}
                </Text>
              </>
            ) : (
              <Text className="text-[1.6rem] font-bold text-text-secondary dark:text-dark-text-secondary">
                Sélectionner une catégorie
              </Text>
            )}
            <Ionicons
              name="chevron-down"
              size={24}
              color="#aaa"
              className="ml-auto"
            />
          </Pressable>
        </View>

        <Modal
          visible={showCategoryModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowCategoryModal(false)}
        >
          <View className="flex-1 justify-end bg-black/50">
            <View className="bg-surface dark:bg-dark-surface rounded-t-3xl p-6 pb-8">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-bold text-text dark:text-dark-text">
                  Sélectionner une catégorie
                </Text>
                <Pressable onPress={() => setShowCategoryModal(false)}>
                  <Ionicons name="close" size={24} color="#aaa" />
                </Pressable>
              </View>
              <ScrollView className="max-h-[60vh]">
                {Object.values(CATEGORY_KEY).map((category) => (
                  <Pressable
                    key={category}
                    className={`flex-row items-center p-4 rounded-xl mb-2 ${
                      selectedCategory === category
                        ? "bg-accent/20"
                        : "bg-surface-secondary dark:bg-dark-surface-secondary"
                    }`}
                    onPress={() => {
                      setSelectedCategory(category);
                      setShowCategoryModal(false);
                    }}
                  >
                    <Image
                      source={{ uri: MAP_CATEGORY_TO_ICON[category] }}
                      style={{ width: 24, height: 24 }}
                    />
                    <Text
                      className={`ml-3 text-base font-medium ${
                        selectedCategory === category
                          ? "text-accent"
                          : "text-text dark:text-dark-text"
                      }`}
                    >
                      {category}
                    </Text>
                    {selectedCategory === category && (
                      <Ionicons
                        name="checkmark"
                        size={20}
                        color="#f75f40"
                        className="ml-auto"
                      />
                    )}
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        <View className="mt-2 gap-4">
          <Text className="dark:text-dark-text-secondary text-text-secondary font-semibold text-sm">
            Date (JJ/MM/AAAA)
          </Text>
          <Pressable
            className="h-16 p-4 flex-row items-center dark:bg-dark-surface bg-surface rounded-xl"
            onPress={() => setShowDatePicker(true)}
          >
            <Text className="text-[1.6rem] font-bold text-text dark:text-dark-text">
              {formatDateForDisplay(date)}
            </Text>
          </Pressable>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setDate(selectedDate);
                }
              }}
            />
          )}
        </View>

        <Pressable
          onPress={handleAddExpense}
          className="rounded-xl bg-accent active:opacity-80 mt-14"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 50,
          }}
        >
          <Text className="text-center text-white font-medium text-[20px]">
            {paramsId
              ? selectedType === "expense"
                ? "Modifier la dépense"
                : "Modifier le revenu"
              : selectedType === "expense"
                ? "Ajouter la dépense"
                : "Ajouter le revenu"}
          </Text>
        </Pressable>

        {loading ? (
          <Modal visible={loading} transparent>
            <View className="flex-1 justify-center items-center bg-black/50">
              <ActivityIndicator size="large" color="white" />
            </View>
          </Modal>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddScreen;
