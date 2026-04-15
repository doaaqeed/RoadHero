import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type FormData = {
  vehicle: string;
  vehicleType: string;
  count: number;
};

export default function TireService() {
  const { handleSubmit, setValue, watch } = useForm<FormData>({
    defaultValues: {
      vehicle: "",
      vehicleType: "",
      count: 0,
    },
  });

  const count = watch("count");

  const onSubmit = (data: FormData) => {
    //console.log(data);
    router.push("/waitingScreen");
  };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <MaterialCommunityIcons name="tire" size={40} color="#4FC3F7" />
          <Text style={{ fontSize: 35, fontWeight: "bold" }}>Tire</Text>
        </View>

        <TextInput
          placeholder="Vehicle model"
          value={watch("vehicle")}
          onChangeText={(text) => setValue("vehicle", text)}
          style={styles.input}
        />

        <TextInput
          placeholder="Tire type/number"
          value={watch("vehicleType")}
          onChangeText={(text) => setValue("vehicleType", text)}
          style={styles.input}
        />

        <Text
          style={{ fontSize: 20, color: "grey", marginLeft: 30, marginTop: 50 }}
        >
          Choose the quantity as your need
        </Text>

        <View style={styles.counterRow}>
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
            <MaterialCommunityIcons name="tire" size={30} color="#4FC3F7" />
          </View>

          <Text style={{ fontWeight: "bold", fontSize: 20, marginLeft: 10 }}>
            Tires Number
          </Text>

          <View
            style={{
              marginLeft: 10,
              flexDirection: "row",
              alignItems: "center",
              gap: 25,
            }}
          >
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
          disabled={!watch("vehicle") || !watch("vehicleType") || count === 0}
          style={[
            styles.button,
            {
              backgroundColor:
                watch("vehicle") && watch("vehicleType") && count > 0
                  ? "#4FC3F7"
                  : "#b6b3b3",
            },
          ]}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>Confirm</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "white",
  },

  card: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 20,
    padding: 20,
  },

  input: {
    marginTop: 30,
    backgroundColor: "#E0E0E0",
    borderRadius: 20,
    padding: 15,
    shadowRadius: 3,
  },

  sectionText: {
    marginTop: 30,
    color: "gray",
  },

  counterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginLeft: 5,
  },
  counterBtn: {
    backgroundColor: "#f5f3f3",
    borderRadius: 30,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  counterText: {
    fontSize: 18,
  },

  count: {
    fontSize: 16,
    fontWeight: "600",
  },

  button: {
    marginTop: 40,
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },
});
