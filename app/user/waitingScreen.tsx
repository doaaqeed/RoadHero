import Header from "@/components/Header"; // Ensure this path is correct
import { useBroadcastTimer } from "@/hooks/use-broadcast-timer";
import { db } from "@/services/firebaseConfig";
import {
  router,
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import { doc, updateDoc } from "firebase/firestore";
import React, { useCallback, useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function WaitingScreen() {
  const { requestId, serviceTitle, userLat, userLng } = useLocalSearchParams();
  const { timeLeft } = useBroadcastTimer(requestId as string);
  const navigation = useNavigation();
  const hasNavigated = useRef(false);

  const handleCancelRequest = async () => {
    if (!requestId || Array.isArray(requestId)) return;
    try {
      await updateDoc(doc(db, "requests", requestId), {
        status: "canceled",
        canceledAt: new Date().toISOString(),
      });
      router.replace("/(user)");
    } catch (error) {
      Alert.alert("Error", "Could not cancel. Please try again.");
    }
  };

  const showCancelAlert = () => {
    Alert.alert(
      "Cancel Request?",
      "Are you sure you want to stop searching for help?",
      [
        { text: "No, Keep Waiting", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: handleCancelRequest,
        },
      ],
    );
  };

  // 1. Move to next screen when timer ends
  useEffect(() => {
    if (timeLeft <= 0 && !hasNavigated.current) {
      hasNavigated.current = true;
      router.replace({
        pathname: "/user/requestPending",
        params: { requestId, serviceTitle, userLat, userLng },
      });
    }
  }, [timeLeft, requestId, serviceTitle]);

  // 2. iOS Back Prevention (Swipe)
  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
      headerShown: false, // We use our custom Header component instead
    });
  }, [navigation]);

  // 3. Android Back Prevention
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        showCancelAlert();
        return true;
      };
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );
      return () => subscription.remove();
    }, [requestId]),
  );

  return (
    <View style={styles.mainContainer}>
      <Stack.Screen options={{ gestureEnabled: false, headerShown: false }} />

      {/* Custom Header with Back button that triggers Alert */}
      <Header
        title="Searching..."
        showBackButton={true}
        onBackPress={showCancelAlert}
      />

      <View style={styles.content}>
        <Text style={styles.title}>Searching for RoadHero providers...</Text>

        <ActivityIndicator size="large" color="#f07e41" />

        <View style={styles.timerBox}>
          <Text style={styles.timerText}>{timeLeft}s</Text>
        </View>

        <TouchableOpacity style={styles.cancelBtn} onPress={showCancelAlert}>
          <Text style={styles.cancelBtnText}>Cancel Request</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 40,
    color: "#333",
    textAlign: "center",
  },
  timerBox: {
    marginTop: 40,
    padding: 20,
    borderRadius: 50,
    backgroundColor: "#f8f9fa",
  },
  timerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  cancelBtn: {
    marginTop: 60,
    padding: 10,
  },
  cancelBtnText: {
    color: "#e74c3c",
    fontSize: 16,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
