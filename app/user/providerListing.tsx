import Header from "@/components/Header";
import { db } from "@/services/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Provider = {
  id: string;
  name: string;
  rating: number;
  phone: string;
  bgColor: string;
  iconColor: string;
  skills: string[];
  eta: string;
};

// Updated with your snippets' constants: ROAD_FACTOR & AVG_SPEED_KMH
const calculateETA = (
  userLat: number,
  userLng: number,
  provLat: number,
  provLng: number,
) => {
  const AVG_SPEED_KMH = 50;
  const ROAD_FACTOR = 1.25;
  const R = 6371;

  const dLat = (provLat - userLat) * (Math.PI / 180);
  const dLon = (provLng - userLng) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(userLat * (Math.PI / 180)) *
      Math.cos(provLat * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2;

  const straightLine = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const mins =
    Math.round(((straightLine * ROAD_FACTOR) / AVG_SPEED_KMH) * 60) + 5;

  return mins;
};

export default function ProviderListing() {
  const { requestId, serviceTitle, userLat, userLng } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [availableProviders, setAvailableProviders] = useState<Provider[]>([]);

  const handleSelectProvider = async (provider: Provider) => {
    if (!requestId) {
      Alert.alert("Error", "Request ID is missing.");
      return;
    }

    try {
      setLoading(true);
      await updateDoc(doc(db, "requests", String(requestId)), {
        providerId: provider.id,
        providerName: provider.name,
        providerPhone: provider.phone,
        status: "assigned",
        assignedAt: new Date().toISOString(),
      });

      router.push({
        pathname: "/shared/request-progress" as any,
        params: {
          mode: "user",
          requestId: String(requestId),
          providerId: provider.id,
          providerName: provider.name,
          serviceTitle: serviceTitle ?? "",
        },
      });
    } catch (error) {
      console.error("Assignment error:", error);
      Alert.alert("Error", "Could not assign provider.");
    } finally {
      setLoading(false);
    }
  };

  const handleCall = (phone: string) => {
    const cleaned = phone?.replace(/[^\d+]/g, "");
    if (!cleaned || cleaned.length < 7) {
      Alert.alert("Unavailable", "This provider has no phone number on file.");
      return;
    }
    Linking.openURL(`tel:${cleaned}`);
  };

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);

        const q = query(
          collection(db, "providers"),
          where("available", "==", true),
          where("skills", "array-contains", String(serviceTitle)),
        );
        const querySnapshot = await getDocs(q);
        const fetched: Provider[] = [];

        for (const docSnap of querySnapshot.docs) {
          const data = docSnap.data();

          // Fetch name AND phone from users collection (same doc ID as provider)
          let fullName = "RoadHero Pro";
          let phoneNumber = "";
          try {
            const userDocSnap = await getDoc(doc(db, "users", docSnap.id));
            if (userDocSnap.exists()) {
              const userData = userDocSnap.data();
              fullName = userData.fullName || fullName;
              phoneNumber = userData.phoneNumber || userData.phone || "";
            }
          } catch (e) {
            console.warn("Could not fetch user data for provider:", docSnap.id);
          }

          // ✅ Rating Logic calculation from snippet
          const ratingsArray: number[] = data.ratings || [];
          const avgRating = ratingsArray.length
            ? parseFloat(
                (
                  ratingsArray.reduce((s: number, r: number) => s + r, 0) /
                  ratingsArray.length
                ).toFixed(1),
              )
            : (data.averageRating ?? 5.0);

          // ✅ ETA Logic calculation from snippet
          let estimatedTime = "Ready";
          if (data.location && userLat && userLng) {
            const mins = calculateETA(
              parseFloat(userLat as string),
              parseFloat(userLng as string),
              data.location.latitude,
              data.location.longitude,
            );
            estimatedTime = `${mins} mins`;
          }

          fetched.push({
            id: docSnap.id,
            name: fullName,
            rating: avgRating, // ✅ Integrated dynamic rating
            phone: phoneNumber,
            bgColor: "#F0F4F8",
            iconColor: "#f07e41",
            skills: data.skills || [],
            eta: estimatedTime, // ✅ Integrated updated ETA calculation
          });
        }

        setAvailableProviders(fetched);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [serviceTitle, userLat, userLng]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header title="Choose Provider" showBackButton={true} />

      <View style={styles.sheet}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Available Heroes</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{availableProviders.length}</Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={ORANGE} />
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            {availableProviders.map((provider) => (
              <View key={provider.id} style={styles.providerCard}>
                <View style={styles.avatarBox}>
                  <Ionicons name="person" size={30} color={ORANGE} />
                </View>

                <View style={styles.infoCol}>
                  <Text style={styles.providerName}>{provider.name}</Text>
                  <View style={styles.metaRow}>
                    <Ionicons name="star" size={14} color="#FFD700" />
                    <Text style={styles.ratingText}>
                      {provider.rating.toFixed(1)}
                    </Text>
                    <Text style={styles.dot}>•</Text>
                    <Text style={styles.etaText}>🕒 {provider.eta}</Text>
                  </View>
                </View>

                <View style={styles.actionCol}>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => handleSelectProvider(provider)}
                  >
                    <Text style={styles.requestBtnText}>Request</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionBtn, styles.callBtnVariant]}
                    onPress={() => handleCall(provider.phone)}
                  >
                    <Ionicons name="call" size={16} color={ORANGE} />
                    <Text style={styles.callBtnText}>Call</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const ORANGE = "#f07e41";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ORANGE },
  sheet: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 25,
  },
  title: { fontSize: 22, fontWeight: "800", color: "#1E293B" },
  badge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: { color: "#64748B", fontWeight: "bold" },
  providerCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    elevation: 2,
  },
  avatarBox: {
    width: 55,
    height: 55,
    borderRadius: 16,
    backgroundColor: "#FFF7ED",
    alignItems: "center",
    justifyContent: "center",
  },
  infoCol: { flex: 1, marginLeft: 15 },
  providerName: { fontSize: 16, fontWeight: "700", color: "#1E293B" },
  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
    marginLeft: 4,
  },
  dot: { marginHorizontal: 8, color: "#CBD5E1" },
  etaText: { fontSize: 13, color: "#64748B", fontWeight: "500" },
  actionCol: { alignItems: "center", gap: 8 },
  actionBtn: {
    backgroundColor: ORANGE,
    width: 90,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  callBtnVariant: {
    backgroundColor: "#FFF7ED",
    borderWidth: 1,
    borderColor: ORANGE,
    flexDirection: "row",
    gap: 5,
  },
  requestBtnText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  callBtnText: { color: ORANGE, fontWeight: "bold", fontSize: 13 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
