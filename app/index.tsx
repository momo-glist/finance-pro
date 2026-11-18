import { useAuth } from "@clerk/expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useCallback, useEffect, useState } from "react";

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);

  const checkOnboardingStatus = useCallback(async () => {
    try {
      const seen = await AsyncStorage.getItem("hasSeenOnboarding");
      setHasSeenOnboarding(seen === "true");
    } catch (error) {
      console.error("Erreur lors de la vérification de l'onboarding :", error);
      setHasSeenOnboarding(true);
    }
  }, []);

  // AsyncStorage is an external system; this effect intentionally updates local state.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    void checkOnboardingStatus();
  }, [checkOnboardingStatus]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!isLoaded || hasSeenOnboarding === null) {
    return null;
  }

  if (!hasSeenOnboarding) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  if (isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/Sign-in" />;
}
