import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import "react-native-reanimated";
import OfflineBanner from "../components/offline-banner";
import { useSync } from "../hooks/use-sync";
import { initDB } from "../utils/offline-storage";
import WelcomeScreen from "./welcomeSplash";
let hasFinishedSplash = false;
const queryClient = new QueryClient();
export default function RootLayout() {
  const [isAppReady, setIsAppReady] = useState(hasFinishedSplash);

  useEffect(() => {
    initDB();
    if (hasFinishedSplash) return;

    const timer = setTimeout(() => {
      hasFinishedSplash = true;
      setIsAppReady(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
  useSync();
  return (
    <QueryClientProvider client={queryClient}>
      <View style={{ flex: 1 }}>
        <OfflineBanner />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="selectRole" />
          <Stack.Screen name="login" />
        </Stack>

        {!isAppReady && (
          <View style={StyleSheet.absoluteFill}>
            <WelcomeScreen />
          </View>
        )}

        <StatusBar style="dark" />
      </View>
    </QueryClientProvider>
  );
}
