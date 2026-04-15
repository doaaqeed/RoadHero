import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function FuelService() {
  const [count, setCount] = useState(0);
  const [fuel, setFuel] = useState<string | null>(null);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <View style={{ width: "100%", maxWidth: 500 }}>
        <View style={styles.container}>
          <MaterialCommunityIcons name="gas-station" size={40} color="green" />
          <Text style={{ fontSize: 35, fontWeight: "bold" }}>Fuel</Text>
        </View>
        <Text
          style={{ fontSize: 20, color: "grey", marginLeft: 30, marginTop: 20 }}
        >
          Choose fuel type as your need
        </Text>
        <View style={styles.cards}>
          <Pressable
            onPress={() => setFuel("gasoline")}
            style={[
              styles.card,
              fuel === "gasoline" && {
                borderColor: "green",
                borderWidth: 3,
                backgroundColor: "#E9FCE9",
              },
            ]}
          >
            <Text style={{ fontWeight: "bold" }}>Gasoline</Text>
          </Pressable>
          <Pressable
            onPress={() => setFuel("diesel")}
            style={[
              styles.card,
              fuel === "diesel" && {
                borderColor: "green",
                borderWidth: 3,
                backgroundColor: "#E9FCE9",
              },
            ]}
          >
            <Text style={{ fontWeight: "bold" }}>Diesel</Text>
          </Pressable>
        </View>
        <Text
          style={{
            fontSize: 20,
            color: "grey",
            marginLeft: 30,
            marginTop: 30,
            marginBottom: 25,
          }}
        >
          Choose the quantity you need
        </Text>
        <View style={styles.counter}>
          <View
            style={{
              backgroundColor: "#f2f0f0de",
              borderRadius: 30,
              width: 60,
              height: 60,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MaterialCommunityIcons name="fuel" size={40} color="green" />
          </View>
          <View style={{ marginLeft: 10, marginTop: 10 }}>
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>
              Fuel quantity
            </Text>
            <Text style={{ color: "grey", fontSize: 15 }}>in liter</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              marginTop: 10,
              marginLeft: 25,
              gap: 25,
            }}
          >
            <Pressable
              onPress={() => setCount(Math.max(0, count - 1))}
              style={{
                backgroundColor: "#f5f3f3",
                borderRadius: 30,
                width: 40,
                height: 40,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 20 }}>-</Text>
            </Pressable>
            <Pressable style={{ marginTop: 7 }}>
              <Text style={{ fontSize: 20 }}>{count}</Text>
            </Pressable>
            <Pressable
              onPress={() => setCount(count + 1)}
              style={{
                backgroundColor: "#f5f3f3",
                borderRadius: 30,
                width: 40,
                height: 40,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 20 }}>+</Text>
            </Pressable>
          </View>
        </View>
        <Pressable
          disabled={!fuel || count === 0}
          style={[
            styles.requestButton,
            {
              backgroundColor: fuel && count > 0 ? "green" : "#b6b3b3",
            },
          ]}
          onPress={() => router.push("/waitingScreen")}
        >
          <Text
            style={{ color: "white", textAlign: "center", fontWeight: "600" }}
          >
            Confirm
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  screen: {
    backgroundColor: "white",
  },

  container: {
    flexDirection: "row",
    marginTop: 60,
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

  counter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 20,
    maxWidth: 400,
    alignSelf: "center",
    width: "100%",
  },

  requestButton: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 40,
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },
});
