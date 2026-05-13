import { useBroadcastTimer } from "@/hooks/useBroadcastTimer";
import { db } from "@/services/firebaseConfig";
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import { doc, updateDoc } from "firebase/firestore"; // Use updateDoc instead of deleteDoc
import React, { useCallback, useEffect } from "react";
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
  const { requestId } = useLocalSearchParams();
  const { timeLeft } = useBroadcastTimer(requestId);
  const navigation = useNavigation();

  const handleCancelRequest = async () => {
    if (!requestId || Array.isArray(requestId)) return;

    try {
      await updateDoc(doc(db, "requests", requestId), {
        status: "canceled",
        canceledAt: new Date().toISOString(),
      });

      router.replace("/(user)");
    } catch (error) {
      Alert.alert("Error", "Could not cancel the request. Please try again.");
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
  // 3. iOS Fix: Disable Swipe and Intercept Header Back
  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: false, // Disables the iPhone swipe-to-back gesture
      headerLeft: () => (
        <TouchableOpacity onPress={showCancelAlert} style={{ marginLeft: 10 }}>
          <Text style={{ fontSize: 16 }}>Back</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // 4. Android Fix: Physical Back Button
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        showCancelAlert();
        return true; // Prevents default behavior
      };
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );
      return () => subscription.remove();
    }, [requestId]),
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Searching for RoadHero providers...</Text>
      <ActivityIndicator size="large" color="black" />
      <View style={styles.timerBox}>
        <Text style={styles.timerText}>{timeLeft}s</Text>
      </View>

      <TouchableOpacity style={styles.cancelBtn} onPress={showCancelAlert}>
        <Text style={styles.cancelBtnText}>Cancel Request</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 40,
    color: "#333",
  },
  timerBox: {
    marginTop: 40,
    padding: 20,
    borderRadius: 50,
    backgroundColor: "#f8f9fa",
  },
  timerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  cancelBtn: { marginTop: 60, padding: 10 },
  cancelBtnText: {
    color: "#e74c3c",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
