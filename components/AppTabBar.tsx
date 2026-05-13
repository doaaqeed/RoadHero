import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

//const hiddenRoutes = ["index", "request-progress"];

export default function AppTabBar({ state, descriptors, navigation }: any) {
  const visibleRoutes = state.routes.filter((route: any) => {
    const { options } = descriptors[route.key];

    // 1. If href is explicitly null, hide it.
    if (options.href === null) return false;

    // 2. If it's a known service screen and href is undefined, hide it anyway
    // (This is a safety net for when the layout isn't syncing properly)
    const serviceScreens = [
      "fuelService",
      "providerListing",
      "requestPending",
      "tireService",
      "towService",
      "waitingScreen",
      "[id]",
      "service-requests",
    ];

    if (serviceScreens.includes(route.name) && options.href === undefined) {
      return false;
    }

    return true;
  });

  return (
    <View style={styles.tabBar}>
      {visibleRoutes.map((route: any) => {
        const originalIndex = state.routes.findIndex(
          (item: any) => item.key === route.key,
        );

        const { options } = descriptors[route.key];
        const label = options.title || route.name;
        const isFocused = state.index === originalIndex;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        let iconName: keyof typeof Ionicons.glyphMap = "ellipse-outline";

        if (route.name === "index") {
          // This covers the Home/Dashboard for both User and Provider
          iconName = isFocused ? "grid" : "grid-outline";
        }

        if (route.name === "profile") {
          iconName = isFocused ? "person-circle" : "person-circle-outline";
        }

        /*if (route.name === "dashboard") {
          iconName = "grid";
        }*/

        const color = isFocused ? "#6e6a66ff" : "#ffffff";

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tabItem}
            activeOpacity={0.8}
            onPress={onPress}
          >
            <Ionicons name={iconName} size={28} color={color} />
            <Text style={[styles.label, { color }]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 70,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: "#f07e41",
    borderTopWidth: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },

  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  label: {
    fontSize: 12,
    marginTop: 2,
  },
});
