import { auth } from "@/services/firebaseConfig";
import { createProviderProfile } from "@/services/providerService";
import { Checkbox } from "expo-checkbox";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    BackHandler,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const SERVICE_OPTIONS = [
  {
    id: "tow_pickup",
    label: "Pickup Tow",
    image: require("@/assets/images/pickup.png"),
  },
  {
    id: "tow_medium",
    label: "Medium Truck",
    image: require("@/assets/images/smallTruck.png"),
  },
  {
    id: "tow_large",
    label: "Large Truck",
    image: require("@/assets/images/largeTruck.png"),
  },
  { id: "tire_change", label: "Tire Change", image: null },
  { id: "fuel_petrol", label: "Fuel (Petrol)", image: null },
  { id: "fuel_diesel", label: "Fuel (Diesel)", image: null },
  { id: "mechanic", label: "Mechanic", image: null },
  { id: "jump_start", label: "Jump Start", image: null },
];

export default function ProviderSkills() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 1. Prevent Back Button (Android)
  useEffect(() => {
    const backAction = () => true; // Returning true disables the back button
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  const toggleSkill = (id: string) => {
    setSelectedSkills((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        // Saves to 'providers' collection using Auth UID
        await createProviderProfile(user.uid, {}, selectedSkills);
        router.replace("/(provider)");
      }
    } catch (error) {
      Alert.alert("Error", "Could not save profile.");
    } finally {
      setLoading(false);
    }
  };

  const isButtonDisabled = selectedSkills.length === 0 || loading;

  return (
    <View style={styles.container}>
      {/* 2. Prevent Swipe Back (iOS) and Hide Header */}
      <Stack.Screen
        options={{
          headerShown: false,
          gestureEnabled: false, // Disables left-to-right swipe on iPhone
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerText}>Configure Your Services</Text>
        <Text style={styles.subHeaderText}>
          Which vehicles and services do you have available?
        </Text>

        {SERVICE_OPTIONS.map((item) => (
          <Pressable
            key={item.id}
            style={[
              styles.card,
              selectedSkills.includes(item.id) && styles.selectedCard,
            ]}
            onPress={() => toggleSkill(item.id)}
          >
            <View style={styles.row}>
              <View style={styles.leftSection}>
                <Checkbox
                  value={selectedSkills.includes(item.id)}
                  onValueChange={() => toggleSkill(item.id)}
                  color={
                    selectedSkills.includes(item.id) ? "#FD6B22" : undefined
                  }
                />
                <Text style={styles.label}>{item.label}</Text>
              </View>

              {item.image && (
                <Image
                  source={item.image}
                  style={styles.vehicleImage}
                  resizeMode="contain"
                />
              )}
            </View>
          </Pressable>
        ))}

        <Pressable
          onPress={handleFinish}
          disabled={isButtonDisabled}
          style={[
            styles.btn,
            { backgroundColor: isButtonDisabled ? "#ccc" : "#FD6B22" },
          ]}
        >
          <Text style={styles.btnText}>
            {loading ? "Saving..." : "Finish Registration"}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  scrollContent: { padding: RFValue(20), paddingTop: RFValue(50) },
  headerText: { fontSize: RFValue(24), fontWeight: "bold", color: "#333" },
  subHeaderText: {
    fontSize: RFValue(14),
    color: "#777",
    marginBottom: 25,
    marginTop: 5,
  },
  card: {
    backgroundColor: "#FFF",
    height: RFValue(65), // Standardized height for all cards
    paddingHorizontal: 15,
    borderRadius: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EEE",
    justifyContent: "center",
  },
  selectedCard: {
    borderColor: "#FD6B22",
    backgroundColor: "#FFF9F6",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  label: {
    fontSize: RFValue(15),
    fontWeight: "500",
    color: "#333",
    marginLeft: 15,
  },
  vehicleImage: { width: 70, height: 40 },
  btn: {
    marginTop: 20,
    paddingVertical: RFValue(18),
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 40,
  },
  btnText: { color: "#FFF", fontWeight: "bold", fontSize: RFValue(16) },
});
