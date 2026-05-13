import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import "react-native-reanimated";
import WelcomeScreen from "./welcomeSplash";

let hasFinishedSplash = false;

export default function RootLayout() {
  const [isAppReady, setIsAppReady] = useState(hasFinishedSplash);

  useEffect(() => {
    if (hasFinishedSplash) return;

    const timer = setTimeout(() => {
      hasFinishedSplash = true;
      setIsAppReady(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex: 1 }}>
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
