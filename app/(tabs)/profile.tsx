import { useAuth, useUser } from "@clerk/expo";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import SafeAreaView from "../components/SafeAreaView";

const ProfileScreen = () => {
  const { signOut, isLoaded } = useAuth();
  const { user } = useUser();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!isLoaded) {
    return (
      <SafeAreaView className="flex-1 dark:bg-dark-background bg-background">
        <Text className="dark:text-dark-text text-text">Chargement...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 dark:bg-dark-background bg-background">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="items-center mb-8">
          <View className="w-20 h-20 rounded-full bg-accent justify-center items-center mb-4">
            <Text className="text-3xl font-bold text-white">
              {user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress[0] || "?"}
            </Text>
          </View>
          <Text className="text-2xl font-bold dark:text-dark-text text-text mb-1">
            {user?.firstName} {user?.lastName}
          </Text>
          <Text className="text-base dark:text-dark-text-secondary text-text-secondary">
            {user?.emailAddresses?.[0]?.emailAddress}
          </Text>
        </View>

        <View className="rounded-xl dark:bg-dark-surface bg-surface px-6 py-6 mb-6">
          <Text className="dark:text-dark-text-secondary text-text text-xl font-bold mb-4">
            Informations personnelles
          </Text>
          
          <View className="flex-row justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
            <Text className="text-base dark:text-dark-text-secondary text-text-secondary">Prénom</Text>
            <Text className="text-base font-semibold dark:text-dark-text text-text">
              {user?.firstName || "Non renseigné"}
            </Text>
          </View>
          
          <View className="flex-row justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
            <Text className="text-base dark:text-dark-text-secondary text-text-secondary">Nom</Text>
            <Text className="text-base font-semibold dark:text-dark-text text-text">
              {user?.lastName || "Non renseigné"}
            </Text>
          </View>
          
          <View className="flex-row justify-between items-center py-3">
            <Text className="text-base dark:text-dark-text-secondary text-text-secondary">Email</Text>
            <Text className="text-base font-semibold dark:text-dark-text text-text">
              {user?.emailAddresses?.[0]?.emailAddress}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          className="rounded-xl overflow-hidden active:opacity-80"
          onPress={handleSignOut}
        >
          <View className="bg-red-400 dark:bg-red-500 py-4 items-center">
            <Text className="text-white font-bold text-base">Se déconnecter</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
