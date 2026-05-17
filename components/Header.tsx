import { useNavigation } from "expo-router";
import { Bell, ChevronLeft } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HeaderProps {
  title?: string;
  showNotification?: boolean;
  showBackButton?: boolean;
  onBackPress?: () => void; // Custom function for the Waiting Screen alert
}

export default function Header({
  title,
  showNotification = false, // Default to false
  showBackButton = false, // Default to false
  onBackPress,
}: HeaderProps) {
  const navigation = useNavigation(); // Always called at the top

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        {showBackButton && (
          <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
            <ChevronLeft size={28} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>{title}</Text>
      </View>

      {showNotification && (
        <TouchableOpacity activeOpacity={0.7}>
          <Bell size={24} color="#fff" strokeWidth={2.2} />
        </TouchableOpacity>
      )}

      {/* Keeps title centered if there is a back button but no notification */}
      {showBackButton && !showNotification && <View style={{ width: 28 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#f07e41",
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
});
