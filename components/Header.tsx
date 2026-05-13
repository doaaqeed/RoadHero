import { Bell } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Header(props: { title?: string }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{props.title}</Text>
      <Bell size={24} color="#fff" strokeWidth={2.2} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#f07e41",
    paddingTop: 60,
    paddingBottom: 35,
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
