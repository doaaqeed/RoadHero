import { useColorScheme } from "@/hooks/use-color-scheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import WelcomeScreen from "./welcomeSplash";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);
  const colorScheme = useColorScheme();

  useEffect(() => {
    async function prepare() {
      //is first time
      const hasLaunched = await AsyncStorage.getItem("hasLaunched");
      setShowOnboarding(hasLaunched === null);

      setTimeout(() => {
        setIsAppReady(true);
      }, 3000);
    }
    prepare();
  }, []);

  // only the Welcome Screen appear while first 3 sec
  if (!isAppReady) {
    return <WelcomeScreen />;
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          headerTitle: "",
          headerTransparent: true,
          headerTintColor: "#000000",
        }}
      >
        {/* Conditional initial route */}
        {showOnboarding ? (
          <Stack.Screen name="onboarding" />
        ) : (
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        )}

        {/* Other screens */}
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>

      <StatusBar style="light" />
    </>
    /*<>
      <Stack
        screenOptions={{
          headerTitle: "",
          headerTransparent: true,
          headerTintColor: "#000000",
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />

        <Stack.Screen name="user" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack>

      <StatusBar style="light" />
    </>*/
  );
}
