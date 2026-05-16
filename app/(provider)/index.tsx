import Header from "@/components/Header";
import { auth, db } from "@/services/firebaseConfig";
import * as Location from "expo-location";
import { router } from "expo-router";
import { doc, GeoPoint, getDoc, updateDoc } from "firebase/firestore";
import {
  CheckSquare,
  Fuel,
  LifeBuoy,
  Truck,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

type Service = {
  title: string;
  Icon: LucideIcon;
  bgColor: string;
  iconColor: string;
  skillIds: string[];
};

const ALL_SERVICES: Service[] = [
  {
    title: "Fuel Delivery",
    Icon: Fuel,
    bgColor: "#DCFCE7",
    iconColor: "#16A34A",
    skillIds: ["fuel_petrol", "fuel_diesel"],
  },
  {
    title: "Tow Truck",
    Icon: Truck,
    bgColor: "#FEE2E2",
    iconColor: "#DC2626",
    skillIds: ["tow_pickup", "tow_medium", "tow_large"],
  },
  {
    title: "Tire Repair\n & Replacement",
    Icon: LifeBuoy,
    bgColor: "#CFFAFE",
    iconColor: "#0891B2",
    skillIds: ["tire_change"],
  },
  {
    title: "On-Site Mechanic",
    Icon: Wrench,
    bgColor: "#FEF3C7",
    iconColor: "#D97706",
    skillIds: ["mechanic"],
  },
  {
    title: "Jump Start",
    Icon: Zap,
    bgColor: "#FFEDD5",
    iconColor: "#EA580C",
    skillIds: ["jump_start"],
  },
];

export default function Dashboard() {
  const [pressedCard, setPressedCard] = useState<string | null>(null);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [isAvailable, setIsAvailable] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );

  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const loadProviderData = async () => {
      if (!userId) return;

      try {
        const ref = doc(db, "providers", userId);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();

          setUserSkills(data.skills || []);
          setCompletedCount(data.completedRequests || 0);
          setIsAvailable(data.available || false);
        }
      } catch (error) {
        console.log("Error loading provider data:", error);
      }
    };

    const requestLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({});

      setLocation({
        lat: loc.coords.latitude,
        lng: loc.coords.longitude,
      });
    };

    loadProviderData();
    requestLocation();
  }, [userId]);

  const toggleAvailability = async (value: boolean) => {
    if (!userId) return;

    setIsAvailable(value);

    try {
      await updateDoc(doc(db, "providers", userId), {
        available: value,
        ...(location && {
          location: new GeoPoint(location.lat, location.lng),
        }),
      });
    } catch (error) {
      Alert.alert("Error", "Could not update status");
      setIsAvailable(!value);
    }
  };

  const availableServices = ALL_SERVICES.filter((service) =>
    service.skillIds.some((skillId) => userSkills.includes(skillId))
  );

  return (
    <View style={styles.container}>
      <Header title="Dashboard" />

      <View style={styles.mapContainer}>
        {location && (
          <MapView
            style={styles.map}
            region={{
              latitude: location.lat,
              longitude: location.lng,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
          >
            <Marker
              coordinate={{
                latitude: location.lat,
                longitude: location.lng,
              }}
            />
          </MapView>
        )}

        <View style={styles.availabilityOverlay}>
          <Text style={styles.availabilityText}>
            {isAvailable ? "Online & Visible" : "Offline"}
          </Text>

          <Switch
            value={isAvailable}
            onValueChange={toggleAvailability}
            trackColor={{ false: "#767577", true: "#6ad457" }}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {availableServices.length === 0 ? (
          <Text style={styles.emptyText}>
            No services found for your selected skills.
          </Text>
        ) : (
          availableServices.map(({ title, Icon, bgColor, iconColor }) => (
            <TouchableOpacity
              key={title}
              style={[styles.card, pressedCard === title && styles.cardPressed]}
              activeOpacity={0.9}
              onPress={() =>
                router.push({
                  pathname: "/provider/service-requests" as any,
                  params: { serviceTitle: title },
                })
              }
              onPressIn={() => setPressedCard(title)}
              onPressOut={() => setPressedCard(null)}
            >
              <View style={[styles.iconBox, { backgroundColor: bgColor }]}>
                <Icon size={28} color={iconColor} strokeWidth={2.4} />
              </View>

              <Text style={styles.cardTitle}>{title}</Text>
            </TouchableOpacity>
          ))
        )}

        <TouchableOpacity style={styles.completedCard} activeOpacity={0.9}>
          <View style={styles.completedIcon}>
            <CheckSquare size={24} color="#ffffff" strokeWidth={2.6} />
          </View>
          <View>
            <Text style={styles.cardTitle}>Completed</Text>
            <Text style={styles.cardSubtitle}>
              {completedCount} services this month
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },

  mapContainer: {
    height: 200,
    marginTop: 16,
    marginHorizontal: 16,
    overflow: "hidden",
    backgroundColor: "#e2e8f0",
    borderRadius: 16,
  },

  map: {
    ...StyleSheet.absoluteFillObject,
  },

  availabilityOverlay: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 8,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    elevation: 4,
  },

  availabilityText: {
    fontWeight: "600",
    fontSize: 12,
    color: "#1e293b",
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
    gap: 20,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 28,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 22,
    minHeight: 120,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  cardPressed: {
    transform: [{ scale: 0.97 }],
    elevation: 1,
  },

  iconBox: {
    width: 76,
    height: 76,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },

  cardSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 2,
  },

  completedCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    backgroundColor: "#E3F7DE",
    padding: 20,
    borderRadius: 22,
    minHeight: 100,
    marginTop: 10,
  },

  completedIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: "#6AD457",
    alignItems: "center",
    justifyContent: "center",
  },

  emptyText: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 40,
  },
});