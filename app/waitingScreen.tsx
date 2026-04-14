import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function WaitingScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />

      <Text style={styles.text}>Searching for nearby providers...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },

  text: {
    marginTop: 20,
    fontSize: 14,
    color: "#333",
  },
});
