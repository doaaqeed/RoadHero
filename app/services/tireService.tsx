import { sendServiceRequest } from "@/services/requestService";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

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

  const onSubmit = async (data: FormData) => {
    if (!lat || !lng) {
      Alert.alert("Error", "Location data is missing. Please go back.");
      return;
    }

    setIsSubmitting(true);
    try {
      await sendServiceRequest(
        "Tire Service",
        {
          vehicleModel: data.vehicle,
          tireType: data.vehicleType,
          tireCount: data.count,
        },
        {
          latitude: parseFloat(lat as string),
          longitude: parseFloat(lng as string),
        },
        (address as string) || "Unknown Location",
      );

      router.push("/waitingScreen");
    } catch (error: any) {
      Alert.alert("Request Failed", error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginTop: 120,
          }}
        >
          <MaterialCommunityIcons name="tire" size={40} color="#4FC3F7" />
          <Text style={{ fontSize: 35, fontWeight: "bold" }}>Tire</Text>
        </View>

        <TextInput
          placeholder="Vehicle model (e.g. BMW X5)"
          value={watch("vehicle")}
          onChangeText={(text) => setValue("vehicle", text)}
          style={styles.input}
        />

        <TextInput
          placeholder="Tire type or Size (e.g. 225/45R17)"
          value={watch("vehicleType")}
          onChangeText={(text) => setValue("vehicleType", text)}
          style={styles.input}
        />

        <Text
          style={{ fontSize: 20, color: "grey", marginLeft: 10, marginTop: 50 }}
        >
          Choose the quantity as your need
        </Text>

        <View style={styles.counterRow}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="tire" size={30} color="#4FC3F7" />
          </View>

          <Text
            style={{
              fontWeight: "bold",
              fontSize: 20,
              marginLeft: 10,
              flex: 1,
            }}
          >
            Tires Number
          </Text>

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
          disabled={
            !watch("vehicle") ||
            !watch("vehicleType") ||
            count === 0 ||
            isSubmitting
          }
          style={[
            styles.button,
            {
              backgroundColor:
                watch("vehicle") &&
                watch("vehicleType") &&
                count > 0 &&
                !isSubmitting
                  ? "#4FC3F7"
                  : "#b6b3b3",
            },
          ]}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={{ color: "white", fontWeight: "600", fontSize: 18 }}>
              Confirm
            </Text>
          )}
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
    padding: 20,
  },
  input: {
    marginTop: 25,
    backgroundColor: "#F5F5F5",
    borderRadius: 15,
    padding: 18,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  counterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  iconCircle: {
    backgroundColor: "#f2f0f0de",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
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
  counterText: {
    fontSize: 24,
    color: "#333",
  },
  count: {
    fontSize: 20,
    fontWeight: "bold",
    minWidth: 20,
    textAlign: "center",
  },
  button: {
    marginTop: 200,
    marginBottom: 30,
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
