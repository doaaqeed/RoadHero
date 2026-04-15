import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function TowService() {
  const [selected, setSelected] = useState<string | null>(null);
  const isDisabled = !selected;

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
        onPress={() => router.push("/waitingScreen")}
      >
        <Text
          style={{ color: "white", textAlign: "center", fontWeight: "bold" }}
        >
          Confirm
        </Text>
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
    marginTop: 60,
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
  },

  selectedCard: {
    borderColor: "#ff6b1a",
    borderWidth: 2,
  },

  image: {
    width: 100,
    height: 80,
  },

  button: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    backgroundColor: "#ff6b1a",
    width: "80%",
    paddingVertical: 15,
    borderRadius: 15,
  },
});
