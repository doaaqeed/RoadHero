import Header from "@/components/Header";
import { sendServiceRequest } from "@/services/requestService";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Network from "expo-network";
import { router, useLocalSearchParams } from "expo-router";
import { getAuth } from "firebase/auth";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { saveRequestOffline } from "../../utils/offlineStorage";

export default function FuelService() {
  const [count, setCount] = useState(0);
  const [fuel, setFuel] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const params = useLocalSearchParams();
  const { lat, lng, address } = params;

  const handleConfirm = async () => {
    if (!lat || !lng) {
      Alert.alert(
        "Error",
        "Location data is unavailable, please go back and try again.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      const requestData = {
        userUID: user?.uid || "unknown",
        userEmail: user?.email || "unknown",
        serviceType: "Fuel Delivery",
        address: (address as string) || "Unknown Location",
        location: {
          latitude: parseFloat(lat as string),
          longitude: parseFloat(lng as string),
        },
        details: {
          fuelType: fuel,
          quantity: count,
        },
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      const networkState = await Network.getNetworkStateAsync();

      if (!networkState.isConnected || !networkState.isInternetReachable) {
        await saveRequestOffline(requestData);
        router.replace("/(user)/history");
      } else {
        const requestId = await sendServiceRequest(
          requestData.serviceType,
          requestData.details,
          requestData.location,
          requestData.address,
        );
        const serviceId = fuel === "Gasoline" ? "fuel_petrol" : "fuel_diesel";
        router.push({
          pathname: "/user/waitingScreen",
          params: {
            requestId,
            serviceTitle: serviceId,
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
      <Header title="Fuel Delivery" showBackButton={true} />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <View style={{ width: "100%", maxWidth: 500, paddingBottom: 40 }}>
          <View style={styles.container}>
            <MaterialCommunityIcons
              name="gas-station"
              size={40}
              color="#f07e41"
            />
            <Text style={{ fontSize: 35, fontWeight: "bold" }}>Fuel</Text>
          </View>

          <Text
            style={{
              fontSize: 20,
              color: "grey",
              marginLeft: 25,
              marginTop: 20,
            }}
          >
            Choose fuel type as your need
          </Text>

          <View style={styles.cards}>
            <Pressable
              onPress={() => setFuel("Gasoline")}
              style={[
                styles.card,
                fuel === "Gasoline" && {
                  borderColor: "#f07e41",
                  borderWidth: 3,
                  backgroundColor: "#FFF7ED",
                },
              ]}
            >
              <Text style={styles.cardText}>Gasoline</Text>
            </Pressable>
            <Pressable
              onPress={() => setFuel("Diesel")}
              style={[
                styles.card,
                fuel === "Diesel" && {
                  borderColor: "#f07e41",
                  borderWidth: 3,
                  backgroundColor: "#FFF7ED",
                },
              ]}
            >
              <Text style={styles.cardText}>Diesel</Text>
            </Pressable>
          </View>

          <Text
            style={{
              fontSize: 20,
              color: "grey",
              marginLeft: 25,
              marginTop: 30,
              marginBottom: 25,
            }}
          >
            Choose the quantity you need
          </Text>

          <View style={styles.counter}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="fuel" size={40} color="#f07e41" />
            </View>
            <View style={{ marginLeft: 15, flex: 1 }}>
              <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                Fuel quantity
              </Text>
              <Text style={{ color: "grey", fontSize: 15 }}>in liter</Text>
            </View>
            <View style={styles.counterControls}>
              <Pressable
                onPress={() => setCount(Math.max(0, count - 1))}
                style={styles.counterBtn}
              >
                <Text style={styles.counterBtnText}>-</Text>
              </Pressable>
              <Text style={styles.counterText}>{count}</Text>
              <Pressable
                onPress={() => setCount(count + 1)}
                style={styles.counterBtn}
              >
                <Text style={styles.counterBtnText}>+</Text>
              </Pressable>
            </View>
          </View>

          <Pressable
            disabled={!fuel || count === 0 || isSubmitting}
            style={[
              styles.requestButton,
              {
                backgroundColor:
                  fuel && count > 0 && !isSubmitting ? "#f07e41" : "#b6b3b3",
              },
            ]}
            onPress={handleConfirm}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Confirm</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "white",
  },
  container: {
    flexDirection: "row",
    marginTop: 30,
    alignItems: "center",
    gap: 15,
    marginLeft: 25,
  },
  cards: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
    gap: 20,
    flexWrap: "wrap",
  },
  card: {
    width: 140,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#bbb5b5",
    borderRadius: 20,
  },
  cardText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 25,
    maxWidth: 500,
    alignSelf: "center",
    width: "100%",
  },
  iconCircle: {
    backgroundColor: "#f2f0f0de",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  counterControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  counterBtn: {
    backgroundColor: "#f5f3f3",
    borderRadius: 30,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  counterBtnText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
  },
  counterText: {
    fontSize: 20,
    fontWeight: "bold",
    minWidth: 20,
    textAlign: "center",
  },
  requestButton: {
    alignSelf: "center",
    marginTop: 60,
    width: "85%",
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
