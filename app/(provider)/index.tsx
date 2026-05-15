import * as Location from "expo-location";
import { router } from "expo-router";
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
import MapView, { Marker } from "react-native-maps"; // Removed PROVIDER_GOOGLE import

import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Header from "@/components/Header";
import { auth, db } from "@/services/firebaseConfig"; // Ensure auth is exported
import { doc, GeoPoint, getDoc, updateDoc } from "firebase/firestore";

type Service = {
  title: string;
  Icon: LucideIcon;
  bgColor: string;
  iconColor: string;
};

const ALL_SERVICES: Service[] = [
  {
    title: "Fuel Delivery",
    Icon: Fuel,
    bgColor: "#DCFCE7",
    iconColor: "#16A34A",
  },
  { title: "Tow Truck", Icon: Truck, bgColor: "#FEE2E2", iconColor: "#DC2626" },
  {
    title: "Tire Service",
    Icon: LifeBuoy,
    bgColor: "#CFFAFE",
    iconColor: "#0891B2",
  },
  {
    title: "On-site Mechanic",
    Icon: Wrench,
    bgColor: "#FEF3C7",
    iconColor: "#D97706",
  },
  { title: "Jump Start", Icon: Zap, bgColor: "#FFEDD5", iconColor: "#EA580C" },
];

export default function Dashboard() {
  const [pressedCard, setPressedCard] = useState<string | null>(null);
  const [completedCount, setCompletedCount] = useState(0);
  const [isAvailable, setIsAvailable] = useState(false);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null,
  );

  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (!userId) return;

    const loadProviderData = async () => {
      try {
        const docRef = doc(db, "providers", userId);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          const data = snap.data();
          setCompletedCount(data.completedRequests || 0);
          setUserSkills(data.skills || []);
          setIsAvailable(data.available || false);
        }
      } catch (error) {
        console.log("Error loading provider data:", error);
      }
    };

    const requestLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      let loc = await Location.getCurrentPositionAsync({});
      setLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
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
        // Update location "truth" when they go online
        ...(location && { location: new GeoPoint(location.lat, location.lng) }),
      });
    } catch (error) {
      Alert.alert("Error", "Could not update status");
      setIsAvailable(!value);
    }
  };

  // Filter services based on provider's registered skills
  const availableServices = ALL_SERVICES.filter((service) =>
    userSkills.includes(service.title),
  );

  return (
    <View style={styles.container}>
      <Header title="Dashboard" showNotification={true} />

      {/* 1. Truth Map Section (Read-Only) */}
      <View style={styles.mapContainer}>
        {location && (
          <MapView
            style={styles.map}
            // provider property removed here so iOS loads Apple Maps (Mac Maps) natively
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
              coordinate={{ latitude: location.lat, longitude: location.lng }}
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
        <Text style={styles.sectionTitle}>Your Active Services</Text>

        {/* 2. Personalized Service List */}
        {availableServices.length > 0 ? (
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
            >
              <View style={[styles.iconBox, { backgroundColor: bgColor }]}>
                <Icon size={24} color={iconColor} strokeWidth={2.4} />
              </View>
              <Text style={styles.cardTitle}>{title}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyText}>
            No skills assigned to your profile yet.
          </Text>
        )}

        {/* 3. Personalized Stats */}
        <TouchableOpacity
          style={[
            styles.completedCard,
            pressedCard === "completed" && styles.cardPressed,
          ]}
          onPressIn={() => setPressedCard("completed")}
          onPressOut={() => setPressedCard(null)}
        >
          <View style={styles.completedIcon}>
            <CheckSquare size={18} color="#ffffff" strokeWidth={2.6} />
          </View>
          <View>
            <Text style={styles.cardTitle}>Completed</Text>
            <Text style={styles.cardSubtitle}>
              {completedCount} total services completed
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F1F5F9" },
  mapContainer: {
    height: 200,
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#e2e8f0",
  },
  map: { ...StyleSheet.absoluteFillObject },
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
  availabilityText: { fontWeight: "600", fontSize: 12, color: "#1e293b" },
  content: {
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 40,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 4,
    marginLeft: 4,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 18,
    elevation: 3,
  },
  cardPressed: { transform: [{ scale: 0.97 }], elevation: 1 },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: { fontSize: 17, fontWeight: "700", color: "#111827" },
  cardSubtitle: { fontSize: 14, color: "#6B7280", marginTop: 2 },
  completedCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#e3f7deff",
    padding: 18,
    borderRadius: 18,
    marginTop: 10,
  },
  completedIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#6ad457ff",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: { textAlign: "center", color: "#94a3b8", marginTop: 20 },
});
