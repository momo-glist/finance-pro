import useSocialAuth from "@/hook/useSocialAuth";
import { OAUTH } from "@/utils/constants";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { Image, Pressable, Text, View } from "react-native";
import SafeAreaView from "../components/SafeAreaView";

const SignInScreen = () => {
  const { handleSocialAuth, loadingStrategy } = useSocialAuth();

  const isGoogleClicked = loadingStrategy === OAUTH.GOOGLE_OAUTH;
  const isAppleClicked = loadingStrategy === OAUTH.APPLE_OAUTH;
  const isGithubClicked = loadingStrategy === OAUTH.GITHUB_OAUTH;

  const isLoading = isGoogleClicked || isAppleClicked || isGithubClicked;
  return (
    <SafeAreaView
      className="bg-white flex-1 px-6 pt-12 dark:bg-cinder"
      edges={["top"]}
    >
      <Text className="text-center text-5xl font-extrabold tracking-tight text-black uppercase dark:text-athens-gray uppercase font-mono">
        Finance Pro
      </Text>

      <Text className="mt-1 text-center text-[14px] text-gray-600 dark:text-gray-suit">
        Connectez-vous pour accéder à votre espace financier personnalisé.
      </Text>

      <View className="flex items-center justify-center mt-20">
        <LottieView
          source={require("../../assets/Wallet Animation.json")}
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
      </View>

      <View className="dark:bg-gray-suit/10 bg-white flex-1 rounded-t-[36px] px-6 pb-8 pt-6 mt-20">
        <View className="self-center rounded-full dark:bg-secondary bg-magnolia/10 px-3 py-1">
          <Text className="text-xs font-semibold uppercase tracking-[1px] dark:text-athens-gray text-gun-powder">
            Ravi de vous revoir
          </Text>
        </View>

        <Text className="mt-2 text-center text-sm leading-6 dark:text-white/80 text-gray-500">
          Sélectionnez ci-dessous une option de connexion pour continuer et
          accéder à votre compte en toute sécurité.
        </Text>

        <View className="mt-6">
          <Pressable
            className={`will-change-pressable mb-3 h-14 flex-row items-center rounded-2xl border border-gray-300 px-4 active:opacity-90 ${
              isLoading ? "opacity-70" : ""
            }`}
            disabled={isLoading}
            onPress={() => handleSocialAuth("oauth_google")}
          >
            <View className="h-8 w-8 items-center justify-center rounded-full bg-white">
              <Image
                source={require("../../assets/images/google.png")}
                style={{ width: 20, height: 20 }}
              />
            </View>

            <Text className="ml-3 flex-1 text-lg font-semibold dark:text-white">
              {isGoogleClicked
                ? "Connexion en cours..."
                : "Continuer avec Google"}
            </Text>

            <FontAwesome name="angle-right" size={18} color="#5f6e66" />
          </Pressable>
          <Pressable
            className={`will-change-pressable mb-3 h-14 flex-row items-center rounded-2xl border border-gray-300 px-4 active:opacity-90 ${
              isLoading ? "opacity-70" : ""
            }`}
            disabled={isLoading}
            onPress={() => handleSocialAuth("oauth_github")}
          >
            <View className="h-8 w-8 items-center justify-center rounded-full bg-white">
              <FontAwesome6 name="github" size={16} color="#111" />
            </View>

            <Text className="ml-3 flex-1 text-lg font-semibold dark:text-white">
              {isGithubClicked
                ? "Connexion en cours..."
                : "Continuer avec Github"}
            </Text>

            <FontAwesome name="angle-right" size={16} color="#111" />
          </Pressable>
          <Pressable
            className={`mb-3 h-14 flex-row items-center dark:bg-white/95  bg-cinder rounded-2xl px-4 active:opacity-90 ${
              isLoading ? "opacity-70" : ""
            }`}
            disabled={isLoading}
            onPress={() => handleSocialAuth("oauth_apple")}
          >
            <View className="h-8 w-8 items-center justify-center rounded-full bg-white">
              <FontAwesome6 name="apple" size={18} color="#5f6e66" />
            </View>

            <Text className="ml-3 flex-1 text-lg font-semibold dark:text-black text-white">
              {isAppleClicked
                ? "Connexion en cours..."
                : "Continuer avec Apple"}
            </Text>

            <FontAwesome name="angle-right" size={18} color="#5f6e66" />
          </Pressable>
        </View>

        <Text className="mt-3 text-center text-sm leading-5 dark:text-white/50 text-gray-500">
          En continuant, vous accepez nos conditions et notre politique de
          confidentialité
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default SignInScreen;
