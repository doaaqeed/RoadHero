/*import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import WelcomeScreen from "./welcomeSplash";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

export default function RootLayout() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    async function prepare() {
      try {
        const hasLaunched = await AsyncStorage.getItem("hasLaunched");
        // If hasLaunched is null, it's the first time
        setShowOnboarding(hasLaunched === null);
      } catch (e) {
        console.warn("Error checking launch status:", e);
        setShowOnboarding(false); // Default to false on error to not block user
      } finally {
        // Keep splash screen for 3 seconds
        setTimeout(() => {
          setIsAppReady(true);
        }, 3000);
      }
    }
    prepare();
  }, []);

  // While checking storage or waiting on splash timer
  if (!isAppReady || showOnboarding === null) {
    return <WelcomeScreen />;
  }

  return (
    <>
      <Stack
        initialRouteName={showOnboarding ? "onboarding" : "(tabs)"}
        screenOptions={{
          headerShown: false,
          headerTitle: "",
          headerTransparent: true,
        }}
      >
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="selectRole" />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
*/
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import WelcomeScreen from "./welcomeSplash";

export default function RootLayout() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    // Show splash for 3 seconds
    const timer = setTimeout(() => {
      setIsAppReady(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!isAppReady) {
    return <WelcomeScreen />;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="selectRole" />
        <Stack.Screen name="login" />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
