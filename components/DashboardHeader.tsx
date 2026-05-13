import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Bell } from "lucide-react-native";

export default function DashboardHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Dashboard</Text>
      <Bell size={24} color="#fff" strokeWidth={2.2} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#f07e41",
    paddingTop: 60,
    paddingBottom: 50,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
});