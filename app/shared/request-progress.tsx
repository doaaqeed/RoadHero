import Header from "@/components/Header";
import { db } from "@/services/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useLocalSearchParams } from "expo-router";
import {
  doc,
  GeoPoint,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

const steps = [
  { title: "Request sent", status: "assigned" },
  { title: "Provider accepted", status: "accepted" },
  { title: "On the way", status: "on_the_way" },
  { title: "Arrived at location", status: "arrived" },
  { title: "Issue fixed", status: "fixed" },
];

const getStepIndex = (status: string) => {
  const index = steps.findIndex((step) => step.status === status);
  return index === -1 ? 0 : index;
};

export default function RequestProgressScreen() {
  const { requestId, mode } = useLocalSearchParams();
  const isProvider = mode === "provider";

  const [status, setStatus] = useState("assigned");

  const [userLocation, setUserLocation] = useState<any>(null);
  const [providerLocation, setProviderLocation] = useState<any>(null);

  const currentStep = getStepIndex(status);
  const progressPercent = ((currentStep + 1) / steps.length) * 100;
  const currentStatus = steps[currentStep]?.title || "Request sent";

  useEffect(() => {
    if (!requestId) return;

    const ref = doc(db, "requests", String(requestId));

    const unsubscribe = onSnapshot(ref, (snap) => {
      if (!snap.exists()) return;

      const data = snap.data();

      setStatus(data.status || "assigned");

      if (data.location) {
        setUserLocation({
          latitude: data.location.latitude,
          longitude: data.location.longitude,
        });
      }

      if (data.providerLocation) {
        setProviderLocation({
          latitude: data.providerLocation.latitude,
          longitude: data.providerLocation.longitude,
        });
      }
    });

    return () => unsubscribe();
  }, [requestId]);

  useEffect(() => {
    if (!isProvider || status !== "on_the_way" || !requestId) return;

    let interval: any;

    const startProviderLocationUpdates = async () => {
      const { status: permission } =
        await Location.requestForegroundPermissionsAsync();

      if (permission !== "granted") {
        alert("Location permission is needed to update provider location.");
        return;
      }

      interval = setInterval(async () => {
        const loc = await Location.getCurrentPositionAsync({});

        const ref = doc(db, "requests", String(requestId));

        await updateDoc(ref, {
          providerLocation: new GeoPoint(
            loc.coords.latitude,
            loc.coords.longitude
          ),
        });
      }, 5000);
    };

    startProviderLocationUpdates();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isProvider, status, requestId]);

  const updateProgress = async (newStatus: string) => {
    if (!isProvider) return;

    if (!requestId) {
      alert("No request selected.");
      return;
    }

    const ref = doc(db, "requests", String(requestId));

    await updateDoc(ref, {
      status: newStatus,
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header title="Request Progress" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContent}>
          <View style={styles.statusCard}>
            <Text style={styles.smallMuted}>Current status</Text>
            <Text style={styles.statusTitle}>{currentStatus}</Text>

            <View style={styles.progressBox}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>progress</Text>
                <Text style={styles.progressPercent}>
                  {Math.round(progressPercent)}%
                </Text>
              </View>

              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${progressPercent}%` },
                  ]}
                />
              </View>

              <Text style={styles.locationText}>
                {isProvider
                  ? "Tap steps to update the request"
                  : "Watching provider updates live"}
              </Text>
            </View>
          </View>

          <View style={styles.mapCard}>
            <Text style={styles.mapTitle}>Live Location</Text>

            {userLocation ? (
              <MapView
                style={styles.map}
                region={{
                  latitude:
                    providerLocation?.latitude || userLocation.latitude,
                  longitude:
                    providerLocation?.longitude || userLocation.longitude,
                  latitudeDelta: 0.02,
                  longitudeDelta: 0.02,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
              >
                <Marker coordinate={userLocation} title="User location" />

                {providerLocation && (
                  <Marker
                    coordinate={providerLocation}
                    title="Provider location"
                    pinColor="orange"
                  />
                )}
              </MapView>
            ) : (
              <Text style={styles.emptyMap}>Loading location...</Text>
            )}
          </View>

          <View style={styles.timelineCard}>
            <Text style={styles.sectionTitle}>Tracking timeline</Text>

            <Text style={styles.sectionSubtitle}>
              {isProvider
                ? "Tap steps to update Firebase"
                : "Updated by the provider"}
            </Text>

            <View style={{ marginTop: 18 }}>
              {steps.map((step, index) => (
                <Pressable
                  key={step.status}
                  disabled={!isProvider}
                  onPress={() => updateProgress(step.status)}
                  style={({ pressed }) => [
                    styles.timelineRow,
                    isProvider && pressed && styles.timelineRowPressed,
                  ]}
                >
                  <View style={styles.timelineLeft}>
                    <View
                      style={[
                        styles.dot,
                        index <= currentStep
                          ? styles.dotDone
                          : styles.dotPending,
                      ]}
                    >
                      {index <= currentStep ? (
                        <Ionicons name="checkmark" size={16} color="#fff" />
                      ) : (
                        <View style={styles.innerPendingDot} />
                      )}
                    </View>

                    {index !== steps.length - 1 && (
                      <View
                        style={[
                          styles.line,
                          index <= currentStep
                            ? styles.lineDone
                            : styles.linePending,
                        ]}
                      />
                    )}
                  </View>

                  <View style={styles.timelineTextWrap}>
                    <Text style={styles.timelineTitle}>{step.title}</Text>
                    <Text style={styles.timelineTime}>
                      {index <= currentStep ? "Done" : "Waiting"}
                    </Text>

                    {isProvider && index > currentStep && (
                      <Text style={styles.tapHint}>Tap to mark this step</Text>
                    )}
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const ORANGE = "#ff7a1a";
const LIGHT_ORANGE = "#FFEDD5";

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#ececec",
  },

  container: {
    flex: 1,
    backgroundColor: "#ececec",
  },

  mainContent: {
    paddingHorizontal: 16,
    marginTop: 14,
  },

  statusCard: {
    backgroundColor: LIGHT_ORANGE,
    borderRadius: 26,
    padding: 16,
  },

  smallMuted: {
    color: "#000",
    fontSize: 13,
    marginBottom: 4,
  },

  statusTitle: {
    color: "#000",
    fontSize: 24,
    fontWeight: "800",
  },

  progressBox: {
    marginTop: 16,
    backgroundColor: LIGHT_ORANGE,
    borderRadius: 18,
    padding: 14,
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  progressLabel: {
    color: "#000",
    fontSize: 14,
  },

  progressPercent: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "800",
  },

  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "#f5c39b",
    marginTop: 12,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 999,
  },

  locationText: {
    color: "#374151",
    marginTop: 14,
    fontSize: 14,
  },

  mapCard: {
    marginTop: 16,
    backgroundColor: "#fff",
    borderRadius: 26,
    padding: 16,
  },

  mapTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
  },

  map: {
    height: 180,
    borderRadius: 18,
  },

  emptyMap: {
    color: "#6B7280",
    fontWeight: "600",
  },

  timelineCard: {
    marginTop: 16,
    backgroundColor: "#f4f4f5",
    borderRadius: 26,
    padding: 16,
  },

  sectionTitle: {
    color: "#171717",
    fontSize: 24,
    fontWeight: "800",
  },

  sectionSubtitle: {
    color: "#8b8b8b",
    fontSize: 13,
    marginTop: 4,
  },

  timelineRow: {
    flexDirection: "row",
    minHeight: 86,
  },

  timelineRowPressed: {
    opacity: 0.6,
  },

  timelineLeft: {
    width: 34,
    alignItems: "center",
  },

  dot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  dotDone: {
    backgroundColor: ORANGE,
  },

  dotPending: {
    backgroundColor: "#e5e7eb",
  },

  innerPendingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#a1a1aa",
  },

  line: {
    width: 2,
    flex: 1,
    marginTop: 4,
  },

  lineDone: {
    backgroundColor: "#f5c39b",
  },

  linePending: {
    backgroundColor: "#d4d4d8",
  },

  timelineTextWrap: {
    flex: 1,
    paddingLeft: 14,
    paddingTop: 2,
  },

  timelineTitle: {
    color: "#18181b",
    fontSize: 18,
    fontWeight: "800",
  },

  timelineTime: {
    color: "#8b8b8b",
    fontSize: 14,
    marginTop: 4,
  },

  tapHint: {
    color: "#EA580C",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "700",
  },
});