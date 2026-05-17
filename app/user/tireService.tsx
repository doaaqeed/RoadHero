import Header from "@/components/Header";
import { sendServiceRequest } from "@/services/requestService";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Network from "expo-network";
import { router, useLocalSearchParams } from "expo-router";
import { getAuth } from "firebase/auth";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { saveRequestOffline } from "../../utils/offlineStorage";

type FormData = {
  vehicle: string;
  vehicleType: string;
  count: number;
};

export default function TireService() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const params = useLocalSearchParams();
  const { lat, lng, address } = params;

  const { handleSubmit, setValue, watch } = useForm<FormData>({
    defaultValues: {
      vehicle: "",
      vehicleType: "",
      count: 0,
    },
  });

  const count = watch("count");
  const vehicle = watch("vehicle");
  const vehicleType = watch("vehicleType");

  const onSubmit = async (data: FormData) => {
    if (!lat || !lng) {
      Alert.alert("Error", "Location data is missing. Please go back.");
      return;
    }

    setIsSubmitting(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      const requestPayload = {
        userUID: user?.uid || "unknown",
        userEmail: user?.email || "unknown",
        serviceType: "Tire Service",
        address: (address as string) || "Unknown Location",
        location: {
          latitude: parseFloat(lat as string),
          longitude: parseFloat(lng as string),
        },
        details: {
          vehicleModel: data.vehicle,
          tireType: data.vehicleType,
          tireCount: data.count,
        },
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      const networkState = await Network.getNetworkStateAsync();

      if (!networkState.isConnected || !networkState.isInternetReachable) {
        await saveRequestOffline(requestPayload);
        router.replace("/(user)/history");
      } else {
        const requestId = await sendServiceRequest(
          requestPayload.serviceType,
          requestPayload.details,
          requestPayload.location,
          requestPayload.address,
        );

        router.push({
          pathname: "/user/waitingScreen",
          params: {
            requestId,
            serviceTitle: "tire_change",
            userLat: String(lat),
            userLng: String(lng),
          },
        });
      }
    } catch (error: any) {
      Alert.alert("Request Failed", error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header title="Tire Service" showBackButton={true} />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <View style={{ width: "100%", maxWidth: 500, paddingBottom: 40 }}>
          <View style={styles.card}>
            <View style={styles.header}>
              <MaterialCommunityIcons name="tire" size={40} color="#f07e41" />
              <Text style={styles.title}>Tire</Text>
            </View>

            <TextInput
              placeholder="Vehicle model (e.g. BMW X5)"
              value={vehicle}
              onChangeText={(text) => setValue("vehicle", text)}
              style={styles.input}
            />

            <TextInput
              placeholder="Tire type or Size (e.g. 225/45R17)"
              value={vehicleType}
              onChangeText={(text) => setValue("vehicleType", text)}
              style={styles.input}
            />

            <Text style={styles.subLabel}>
              Choose the quantity as your need
            </Text>

            <View style={styles.counterRow}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons name="tire" size={30} color="#f07e41" />
              </View>

              <Text style={styles.counterLabel}>Tires Number</Text>

              <View style={styles.controls}>
                <Pressable
                  onPress={() => setValue("count", Math.max(0, count - 1))}
                  style={styles.counterBtn}
                >
                  <Text style={styles.counterText}>-</Text>
                </Pressable>

                <Text style={styles.count}>{count}</Text>

                <Pressable
                  onPress={() => setValue("count", count + 1)}
                  style={styles.counterBtn}
                >
                  <Text style={styles.counterText}>+</Text>
                </Pressable>
              </View>
            </View>

            <Pressable
              onPress={handleSubmit(onSubmit)}
              disabled={!vehicle || !vehicleType || count === 0 || isSubmitting}
              style={[
                styles.button,
                {
                  backgroundColor:
                    vehicle && vehicleType && count > 0 && !isSubmitting
                      ? "#f07e41"
                      : "#b6b3b3",
                },
              ]}
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Confirm</Text>
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "white" },
  card: { flex: 1, paddingHorizontal: 25 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginTop: 30,
  },
  title: { fontSize: 35, fontWeight: "bold" },
  input: {
    marginTop: 25,
    backgroundColor: "#F5F5F5",
    borderRadius: 15,
    padding: 18,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  subLabel: { fontSize: 20, color: "grey", marginTop: 50 },
  counterRow: { flexDirection: "row", alignItems: "center", marginTop: 20 },
  iconCircle: {
    backgroundColor: "#f2f0f0de",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  counterLabel: { fontWeight: "bold", fontSize: 20, marginLeft: 10, flex: 1 },
  controls: { flexDirection: "row", alignItems: "center", gap: 20 },
  counterBtn: {
    backgroundColor: "#f5f3f3",
    borderRadius: 10,
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DDD",
  },
  counterText: { fontSize: 24, color: "#333" },
  count: {
    fontSize: 20,
    fontWeight: "bold",
    minWidth: 20,
    textAlign: "center",
  },
  button: {
    alignSelf: "center",
    marginTop: 60,
    width: "100%", // Adapts perfectly within the 25px layout page pad
    borderRadius: 15,
    paddingVertical: 18,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
});
