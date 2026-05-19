import * as Network from "expo-network";
import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const checkInitialStatus = async () => {
      const state = await Network.getNetworkStateAsync();
      setIsOffline(!state.isConnected);
    };

    checkInitialStatus();

    const timer = setInterval(async () => {
      const state = await Network.getNetworkStateAsync();
      setIsOffline(!state.isConnected);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  if (!isOffline) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.text}>
          You are currently offline. Requests will be saved locally.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#b91c1c" }, 
  container: {
    backgroundColor: "#b91c1c",
    padding: 10,
    alignItems: "center",
    paddingTop: 25,
  },
  text: { color: "white", fontWeight: "bold", fontSize: 12 },
});
