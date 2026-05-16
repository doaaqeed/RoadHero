import Header from "@/components/Header";
import { db } from "@/services/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type TimelineStep = {
  title: string;
  status: string;
};

const steps: TimelineStep[] = [
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

function TimelineItem({
  title,
  done,
  last = false,
  clickable,
  onPress,
}: {
  title: string;
  done: boolean;
  last?: boolean;
  clickable: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      disabled={!clickable}
      onPress={onPress}
      style={({ pressed }) => [
        styles.timelineRow,
        clickable && pressed && styles.timelineRowPressed,
      ]}
    >
      <View style={styles.timelineLeft}>
        <View style={[styles.dot, done ? styles.dotDone : styles.dotPending]}>
          {done ? (
            <Ionicons name="checkmark" size={16} color="#fff" />
          ) : (
            <View style={styles.innerPendingDot} />
          )}
        </View>

        {!last && (
          <View
            style={[styles.line, done ? styles.lineDone : styles.linePending]}
          />
        )}
      </View>

      <View style={styles.timelineTextWrap}>
        <Text style={styles.timelineTitle}>{title}</Text>
        <Text style={styles.timelineTime}>{done ? "Done" : "Waiting"}</Text>

        {clickable && !done && (
          <Text style={styles.tapHint}>Tap to mark this step</Text>
        )}
      </View>
    </Pressable>
  );
}

export default function RequestProgressScreen() {
  const { requestId, mode } = useLocalSearchParams();

  const isProvider = mode === "provider";

  const [status, setStatus] = useState("assigned");
  const [loading, setLoading] = useState(true);

  const currentStep = getStepIndex(status);
  const progressPercent = ((currentStep + 1) / steps.length) * 100;
  const currentStatus = steps[currentStep]?.title || "Request sent";

  useEffect(() => {
    const loadRequestProgress = async () => {
      if (!requestId) {
        setLoading(false);
        return;
      }

      try {
        const ref = doc(db, "requests", String(requestId));
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          setStatus(data.status || "assigned");
        }
      } catch (error) {
        console.log("Error loading request progress:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRequestProgress();
  }, [requestId]);

  const updateProgress = async (newStatus: string) => {
    if (!isProvider) return;

    if (!requestId) {
      alert("No request selected.");
      return;
    }

    try {
      const ref = doc(db, "requests", String(requestId));

      await updateDoc(ref, {
        status: newStatus,
      });

      setStatus(newStatus);
    } catch (error) {
      console.log("Error updating request progress:", error);
      alert("Failed to update progress.");
    }
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
            <View style={styles.statusRowTop}>
              <View>
                <Text style={styles.smallMuted}>Current status</Text>

                <Text style={styles.statusTitle}>
                  {loading ? "Loading..." : currentStatus}
                </Text>
              </View>
            </View>

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
                    {
                      width: `${progressPercent}%`,
                    },
                  ]}
                />
              </View>

              <Text style={styles.locationText}>
                {isProvider
                  ? "Tap a timeline step to update this request"
                  : "Waiting for provider updates"}
              </Text>
            </View>
          </View>

          <View style={styles.timelineCard}>
            <View style={styles.timelineHeaderRow}>
              <View>
                <Text style={styles.sectionTitle}>Tracking timeline</Text>

                <Text style={styles.sectionSubtitle}>
                  {isProvider
                    ? "Updates will be saved to Firebase"
                    : "Progress updates from the provider"}
                </Text>
              </View>
            </View>

            <View style={{ marginTop: 18 }}>
              {steps.map((step, index) => (
                <TimelineItem
                  key={step.status}
                  title={step.title}
                  done={index <= currentStep}
                  last={index === steps.length - 1}
                  clickable={isProvider}
                  onPress={() => updateProgress(step.status)}
                />
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

  statusRowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 14,
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
    width: "85%",
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

  timelineCard: {
    marginTop: 16,
    backgroundColor: "#f4f4f5",
    borderRadius: 26,
    padding: 16,
  },

  timelineHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
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