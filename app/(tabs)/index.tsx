import { Text, View } from "react-native";
import SafeAreaView from "../components/SafeAreaView";

export default function HomeScreen() {
  return (
    <SafeAreaView className="bg-magnolia dark:bg-cinder flex-1">
      <View className="px-6 pt-12">
        <Text className="text-center text-3xl font-bold text-gun-powder dark:text-athens-gray">
          Bienvenue sur Finance Pro
        </Text>
        <Text className="mt-4 text-center text-gray-600 dark:text-gray-400">
          Votre espace financier personnel
        </Text>
      </View>
    </SafeAreaView>
  );
}
