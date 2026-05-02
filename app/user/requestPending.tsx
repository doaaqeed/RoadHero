import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function RequestPending() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="alert-circle-outline" size={80} color="#f39c12" />

        <Text style={styles.title}>No providers found yet</Text>

        <Text style={styles.description}>
          The automatic search timed out, but you can still choose a RoadHero
          manually from our list.
        </Text>

        <Pressable
          style={styles.button}
          onPress={() => router.push("/user/providerListing")}
        >
          <Text style={styles.buttonText}>View Provider List</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    color: "#333",
  },
  divider: {
    height: 2,
    width: 60,
    backgroundColor: "#eee",
    marginVertical: 20,
  },
  description: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginTop: 25,
    marginBottom: 40,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#5e605f",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 10,
  },
});
