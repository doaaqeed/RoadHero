import { sendServiceRequest } from "@/services/requestService";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

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
        "error",
        "Location data is unavailable, please go back and try again.",
      );
      return;
    }

    setLoading(true);
    try {
      await sendServiceRequest(
        "Tow Truck",
        { vehicleSize: selected },
        {
          latitude: parseFloat(lat as string),
          longitude: parseFloat(lng as string),
        },
        (address as string) || "Nablus",
      );

      router.push("/waitingScreen");
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
    <View style={styles.screen}>
      <View style={{ margin: 20 }}>
        <View style={styles.container}>
          <MaterialCommunityIcons name="truck" size={40} color="#ff6b1a" />
          <Text style={{ fontSize: 35, fontWeight: "bold" }}>Tow Truck</Text>
        </View>

        <Text
          style={{
            fontSize: 20,
            color: "grey",
            marginTop: 20,
            marginBottom: 40,
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
            <Text style={{ marginTop: 10, fontWeight: "bold" }}>
              Mini Truck
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setSelected("pickup")}
            style={[styles.card, selected === "pickup" && styles.selectedCard]}
          >
            <Image
              source={require("@/assets/images/pickup.png")}
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={{ marginTop: 10, fontWeight: "bold" }}>Pickup</Text>
          </Pressable>
        </View>

        <View style={{ alignItems: "center" }}>
          <Pressable
            onPress={() => setSelected("large")}
            style={[styles.card, selected === "large" && styles.selectedCard]}
          >
            <Image
              source={require("@/assets/images/largeTruck.png")}
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={{ marginTop: 10, fontWeight: "bold" }}>
              Large Truck
            </Text>
          </Pressable>
        </View>
      </View>

      <Pressable
        disabled={isDisabled}
        style={[
          styles.button,
          { backgroundColor: isDisabled ? "#ccc" : "#ff6b1a" },
        ]}
        onPress={handleConfirm}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            Confirm
          </Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    marginTop: 120,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  cardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    width: "45%",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  selectedCard: {
    borderColor: "#ff6b1a",
    borderWidth: 2,
    backgroundColor: "#fff7f2",
  },
  image: {
    width: 100,
    height: 80,
  },
  button: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    width: "80%",
    paddingVertical: 18,
    borderRadius: 15,
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
});
