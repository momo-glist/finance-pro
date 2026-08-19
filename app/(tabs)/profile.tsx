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
      <SafeAreaView className="flex-1 dark:bg-cinder bg-magnolia">
        <Text className="dark:text-white text-black">Chargement...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 dark:bg-cinder bg-magnolia">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="items-center mb-8">
          <View className="w-20 h-20 rounded-full bg-royal-blue justify-center items-center mb-4">
            <Text className="text-3xl font-bold text-white">
              {user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress[0] || "?"}
            </Text>
          </View>
          <Text className="text-2xl font-bold dark:text-white text-black mb-1">
            {user?.firstName} {user?.lastName}
          </Text>
          <Text className="text-base dark:text-gray-suit text-gun-powder">
            {user?.emailAddresses?.[0]?.emailAddress}
          </Text>
        </View>

        <View className="rounded-xl dark:bg-shark bg-white px-6 py-6 mb-6">
          <Text className="dark:text-gray-suit text-shark text-xl font-bold mb-4">
            Informations personnelles
          </Text>
          
          <View className="flex-row justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
            <Text className="text-base dark:text-gray-suit text-gun-powder">Prénom</Text>
            <Text className="text-base font-semibold dark:text-white text-black">
              {user?.firstName || "Non renseigné"}
            </Text>
          </View>
          
          <View className="flex-row justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
            <Text className="text-base dark:text-gray-suit text-gun-powder">Nom</Text>
            <Text className="text-base font-semibold dark:text-white text-black">
              {user?.lastName || "Non renseigné"}
            </Text>
          </View>
          
          <View className="flex-row justify-between items-center py-3">
            <Text className="text-base dark:text-gray-suit text-gun-powder">Email</Text>
            <Text className="text-base font-semibold dark:text-white text-black">
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
