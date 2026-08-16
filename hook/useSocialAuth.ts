import { useSSO } from "@clerk/expo";
import { useState } from "react";
import { Alert } from "react-native";

const useSocialAuth = () => {
  const [loadingStrategy, setLoadingStrategy] = useState<string | null>(null);
  const { startSSOFlow } = useSSO();

  const handleSocialAuth = async (
    strategy: "oauth_google" | "oauth_github" | "oauth_apple",
  ) => {
    if (loadingStrategy) return;
    setLoadingStrategy(strategy);

    try {
      const { createdSessionId, setActive } = await startSSOFlow({ strategy });

      if (!createdSessionId) {
        Alert.alert(
          "Authentification incomplète",
          "L'authentification n'est pas complète, veuillez réessayer.",
        );
        return;
      }

      if (typeof setActive !== "function") {
        Alert.alert("Erreur", "Impossible d'activer la session.");
        return;
      }

      await setActive({
        session: createdSessionId,
      });
    } catch (error) {
      console.log("Error in social auth", error);

      Alert.alert("Erreur d'authentification", "L'authentification a échoué.");
    } finally {
      setLoadingStrategy(null);
    }
  };

  return { handleSocialAuth, loadingStrategy };
};

export default useSocialAuth;
