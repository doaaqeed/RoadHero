import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import {
  router,
  Stack,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import React, { useCallback, useEffect } from "react";
import {
  Alert,
  BackHandler,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function RequestPending() {
  const { requestId, serviceTitle, userLat, userLng } = useLocalSearchParams();
  const navigation = useNavigation();

  // Function to handle the exit attempt
  const handleExitRequest = () => {
    Alert.alert(
      "Exit Search?",
      "Are you sure you want to go back to home and cancel the request? You can still view providers manually.",
      [
        { text: "Stay", style: "cancel" },
        {
          text: "Exit to Home",
          style: "destructive",
          onPress: () => router.replace("/(user)"),
        },
      ],
    );
  };

  // 1. iOS Fix: Disable swipe and hide native header
  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
      headerShown: false,
    });
  }, [navigation]);

  // 2. Android Fix: Physical Back Button
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        handleExitRequest();
        return true;
      };
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );
      return () => subscription.remove();
    }, []),
  );

  return (
    <View style={styles.container}>
      {/* Ensure native gestures are locked */}
      <Stack.Screen options={{ gestureEnabled: false, headerShown: false }} />

      {/* Custom Header matching Waiting Screen */}
      <Header
        title="Nearby Help"
        showBackButton={true}
        onBackPress={handleExitRequest}
      />

      <View style={styles.content}>
        <Ionicons name="alert-circle-outline" size={80} color="#f39c12" />

        <Text style={styles.title}>No providers found yet</Text>

        <Text style={styles.description}>
          The automatic search timed out for{" "}
          <Text style={{ fontWeight: "bold" }}>
            {serviceTitle?.toString().replace("_", " ")}
          </Text>
          , but you can still choose a RoadHero manually.
        </Text>

        <Pressable
          style={styles.button}
          onPress={() =>
            router.push({
              pathname: "/user/providerListing",
              params: { requestId, serviceTitle, userLat, userLng },
            })
          }
        >
          <Text style={styles.buttonText}>View Provider List</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </Pressable>

        <TouchableOpacity onPress={handleExitRequest} style={{ marginTop: 30 }}>
          <Text style={styles.backHomeText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    padding: 25,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    color: "#333",
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
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 10,
  },
  backHomeText: {
    color: "#666",
    fontSize: 15,
    textDecorationLine: "underline",
  },
});
