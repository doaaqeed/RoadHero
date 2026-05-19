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
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { saveRequestOffline } from "../../utils/offline-storage";

export default function TowService() {
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const params = useLocalSearchParams();
  const { lat, lng, address } = params;

  const isDisabled = !selected || loading;

  const handleConfirm = async () => {
    if (!selected) return;

    if (!lat || !lng) {
      Alert.alert(
        "Error",
        "Location data is unavailable, please go back and try again.",
      );
      return;
    }

    setLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      const requestPayload = {
        userUID: user?.uid || "unknown",
        userEmail: user?.email || "unknown",
        serviceType: "Tow Truck",
        address: (address as string) || "Nablus",
        location: {
          latitude: parseFloat(lat as string),
          longitude: parseFloat(lng as string),
        },
        details: { vehicleSize: selected },
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
        const towMap = {
          mini: "tow_pickup",
          pickup: "tow_medium",
          large: "tow_large",
        };
        router.push({
          pathname: "/user/waitingScreen",
          params: {
            requestId,
            serviceTitle: towMap[selected as keyof typeof towMap],
            userLat: String(lat),
            userLng: String(lng),
          },
        });
      }
    } catch (error: any) {
      Alert.alert(
        "Request failed",
        error.message || "An error occurred while submitting the request.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header title="Tow Truck Delivery" showBackButton={true} />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <View style={{ width: "100%", maxWidth: 500, paddingBottom: 40 }}>
          <View style={styles.container}>
            <MaterialCommunityIcons name="truck" size={40} color="#f07e41" />
            <Text style={{ fontSize: 35, fontWeight: "bold" }}>Tow Truck</Text>
          </View>

          <Text
            style={{
              fontSize: 20,
              color: "grey",
              marginLeft: 25,
              marginTop: 20,
              marginBottom: 30,
            }}
          >
            Choose vehicle type as your need
          </Text>

          <View style={styles.cardsContainer}>
            <Pressable
              onPress={() => setSelected("mini")}
              style={[styles.card, selected === "mini" && styles.selectedCard]}
            >
              <Image
                source={require("@/assets/images/smallTruck.png")}
                style={styles.image}
                resizeMode="contain"
              />
              <Text style={styles.cardText}>Medium Truck (Flatbed)</Text>
            </Pressable>

            <Pressable
              onPress={() => setSelected("pickup")}
              style={[
                styles.card,
                selected === "pickup" && styles.selectedCard,
              ]}
            >
              <Image
                source={require("@/assets/images/pickup.png")}
                style={styles.image}
                resizeMode="contain"
              />
              <Text style={styles.cardText}>Pickup</Text>
            </Pressable>

            <Pressable
              onPress={() => setSelected("large")}
              style={[styles.card, selected === "large" && styles.selectedCard]}
            >
              <Image
                source={require("@/assets/images/largeTruck.png")}
                style={styles.image}
                resizeMode="contain"
              />
              <Text style={styles.cardText}>Large Truck (Heavy Duty)</Text>
            </Pressable>
          </View>

          <Pressable
            disabled={isDisabled}
            style={[
              styles.button,
              { backgroundColor: isDisabled ? "#b6b3b3" : "#f07e41" },
            ]}
            onPress={handleConfirm}
          >
            {loading ? (
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
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginLeft: 25,
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 16,
  },
  card: {
    width: "45%",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#bbb5b5",
    backgroundColor: "#fff",
  },
  selectedCard: {
    borderColor: "#f07e41",
    borderWidth: 3,
    backgroundColor: "#FFF7ED",
  },
  cardText: {
    textAlign: "center",
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 14,
    color: "#333",
  },
  image: {
    width: 100,
    height: 80,
  },
  button: {
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
