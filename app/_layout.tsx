import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import "react-native-reanimated";
import OfflineBanner from "../components/offlineBanner";
import { useSync } from "../hooks/useSync";
import { initDB } from "../utils/offlineStorage";
import WelcomeScreen from "./welcomeSplash";
let hasFinishedSplash = false;

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
  );
}
