import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Onboarding from "react-native-onboarding-swiper";

const { width, height } = Dimensions.get("window");

const OnboardingScreen = () => {
  const router = useRouter();

  const handleDone = async () => {
    try {
      await AsyncStorage.setItem("hasSeenOnboarding", "true");

      router.replace("/(auth)/Sign-in");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'onboarding :", error);
    }
  };
  return (
    <View style={styles.container}>
      <Onboarding
        onDone={handleDone}
        onSkip={handleDone}
        containerStyles={{ paddingHorizontal: 15 }}
        pages={[
          {
            backgroundColor: "#F1F7FF",
            image: (
              <View>
                <LottieView
                  source={require("../../assets/animations/Finance.json")}
                  autoPlay
                  loop
                  style={styles.lottie}
                />
              </View>
            ),
            title: "Maîtrisez vos finances",
            subtitle:
              "Suivez simplement vos revenus et vos dépenses au quotidien.",
          },

          {
            backgroundColor: "#FFF7F5",
            image: (
              <View>
                <LottieView
                  source={require("../../assets/animations/Finance application.json")}
                  autoPlay
                  loop
                  style={styles.lottie}
                />
              </View>
            ),
            title: "Gérez vos revenus et dépenses",
            subtitle:
              "Enregistrez chaque entrée et chaque dépense pour garder une vision claire de votre budget.",
          },

          {
            backgroundColor: "#F7F3FF",
            image: (
              <View>
                <LottieView
                  source={require("../../assets/animations/Shopping bag.json")}
                  autoPlay
                  loop
                  style={styles.lottie}
                />
              </View>
            ),
            title: "Atteignez vos objectifs financiers",
            subtitle:
              "Analysez vos dépenses, contrôlez votre budget et avancez sereinement vers vos objectifs.",
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  lottie: {
    width: width * 0.9,
    height: width,
  },
});

export default OnboardingScreen;
