import { useTransactionStore } from "@/store/useTransactionsStore";
import {
    ICategoryItem,
    ITransactionType,
} from "@/store/useTransactionsStore.types";
import { CATEGORY_KEY, MAP_CATEGORY_TO_ICON } from "@/utils/constants";
import { LinearGradient } from "expo-linear-gradient";
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
  const [selectedCategory, setSelectedCategory] = useState<
    ICategoryItem | string
  >(category_id || "");
  const [date, setDate] = useState(expense_date || "");
  const { addTransaction, updateTransaction } = useTransactionStore();
  const [loading, setLoading] = useState(false);

  const formatDateForAPI = (inputDate: string) => {
    if (!inputDate) return "";
    const parts = inputDate.split("/");
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return inputDate;
  };

  const formatDateForDisplay = (inputDate: string) => {
    if (!inputDate) return "";
    const parts = inputDate.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return inputDate;
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
    });

    setLoading(false);

    const message = selectedType === "expense" 
      ? "Votre dépense a été ajoutée" 
      : "Votre revenu a été ajoutée";

    Alert.alert("Bravo", message, [
      {
        text: "Ajouter une autre",
        style: "cancel",
        onPress: () => router.push("/add"),
      },
      {
        text: "Voir tout",
        onPress: () => router.push("/expense"),
      },
    ]);

    setAmount("");
    setTitle("");
    setSelectedType("");
    setSelectedCategory("");
    setDate("");
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

    const message = selectedType === "expense" 
      ? "Votre dépense a été modifiée" 
      : "Votre revenu a été modifié";

    Alert.alert("Bravo", message, [
      {
        text: "Ajouter une autre",
        style: "cancel",
        onPress: () => router.push("/add"),
      },
      {
        text: "Voir tout",
        onPress: () => router.push("/expense"),
      },
    ]);

    setAmount("");
    setTitle("");
    setSelectedCategory("");
    setDate("");
  };

  useEffect(() => {
    (setTitle(paramsTitle),
      setSelectedType(type),
      setSelectedCategory(category_id),
      setAmount(paramsAmount),
      setDate(formatDateForDisplay(expense_date)));
  }, [paramsTitle, type, paramsAmount, category_id, expense_date]);

  return (
    <SafeAreaView className="flex-1 dark:bg-cinder bg-magnolio">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="items-center justify-center mt-5">
          <Text className="dark:text-gray-suit text-gray-500 font-semibold text-sm">
            ENTRÉ LE MONTANT
          </Text>
          <View className="flex-row items-center mt-4 gap-6 w-[95%]">
            <TextInput
              className="text-[3.75rem] w-[85%] font-bold text-black dark:text-melrose"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
            <Text className="text-[3rem] font-bold dark:text-white text-percian-blue ">
              F
            </Text>
          </View>
        </View>

        <View className="gap-2 mt-4">
          <Text className="dark:text-gray-suit text-gray-500 font-semibold text-sm">
            TITRE
          </Text>
          <TextInput
            className="h-[4.3rem] p-4 text-[1.6rem] font-bold dark:bg-shark bg-titan-white/50 
            rounded-xl text-black dark:text-melrose"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View className="mt-2 gap-4">
          <Text className="dark:text-gray-suit text-gray-500 font-semibold text-sm">
            CATEGORIE
          </Text>
          <View className="gap-4 flex-row flex-wrap mt-2">
            {Object.values(CATEGORY_KEY).map((category) => {
              return (
                <Text
                  key={category}
                  className={`text-black dark:text-melrose font-medium rounded-full
                px-3 py-6
                ${
                  selectedCategory === category
                    ? "bg-royal-blue dark:text-white"
                    : "dark:bg-shark bg-titan-white/50"
                }`}
                  onPress={() => setSelectedCategory(category)}
                >
                  {category}
                </Text>
              );
            })}
          </View>

          <View className="mt-2 gap-4">
            <Text className="dark:text-gray-suit text-gray-500 font-semibold text-sm">
              ICONE
            </Text>
            <View className="flex-row gap-6 items-center">
              {Object.values(CATEGORY_KEY).map((category) => {
                return (
                  <View
                    key={category}
                    className={`dark:bg-chark-3 bg-shark-3/10 p-2 rounded-lg
                ${
                  selectedCategory === category
                    ? "border border-royal-blue/70 dark:border-royal-blue"
                    : ""
                }`}
                  >
                    <Image
                      source={{ uri: MAP_CATEGORY_TO_ICON[category] }}
                      style={{ width: 26, height: 26 }}
                    />
                  </View>
                );
              })}
            </View>
          </View>

          <View className="mt-2 gap-4">
            <Text className="dark:text-gray-suit text-gray-500 font-semibold text-sm">
              Date (JJ/MM/AAAA)
            </Text>
            <TextInput
              className="h-16 p-4 text-[1.6rem] font-bold dark:bg-shark bg-titan-white/50
            rounded-xl text-black dark:text-melrose"
              value={date}
              onChangeText={setDate}
              placeholder="01/01/2026"
            />
          </View>

          <Pressable
            onPress={handleAddExpense}
            className="rounded-xl overflow-hidden active:opacity-80 mt-14"
          >
            <LinearGradient
              colors={["#C5C0FF", "#5A4FCF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 50,
              }}
            >
              <Text className="text-center text-white font-medium text-[20px]">
                {paramsId 
                  ? (selectedType === "expense" ? "Modifier la dépense" : "Modifier le revenu")
                  : (selectedType === "expense" ? "Ajouter la dépense" : "Ajouter le revenu")
                }
              </Text>
            </LinearGradient>
          </Pressable>

          {loading ? (
            <Modal visible={loading} transparent>
              <View className="flex-1 justify-center items-center bg-black/50">
                <ActivityIndicator size="large" color="white" />
              </View>
            </Modal>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddScreen;
