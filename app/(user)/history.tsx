import Header from "@/components/Header";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { db } from "../../services/firebaseConfig";
import { getOfflineRequests } from "../../utils/offlineStorage";

const STATUS_STYLES: Record<
  string,
  { bg: string; text: string; label?: string }
> = {
  offline: { bg: "#FFF3E0", text: "#EF6C00", label: "Waiting to Sync" },
  assigned: { bg: "#E3F2FD", text: "#1E88E5" },
  pending: { bg: "#E3F2FD", text: "#1E88E5" },
  accepted: { bg: "#E8F5E9", text: "#2E7D32" },
  canceled: { bg: "#FFEBEE", text: "#C62828" },
  timeout: { bg: "#ECEFF1", text: "#546E7A" },
  rejected: { bg: "#FFEBEE", text: "#C62828" },
};

// Global safe fallback config to prevent object property access crashes
const DEFAULT_STATUS_STYLE = { bg: "#E3F2FD", text: "#1E88E5" };

export default function HistoryScreen() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const offlineData = await getOfflineRequests();
      const formattedOffline = (offlineData || []).map((req: any) => ({
        ...req,
        id: `offline-${req.id || Math.random().toString()}`,
        status: "offline",
      }));

      // Fetch Online Requests from Firebase
      const q = query(
        collection(db, "requests"),
        where("userUID", "==", user.uid),
        orderBy("createdAt", "desc"),
      );
      const querySnapshot = await getDocs(q);
      const onlineData = querySnapshot.docs.map((doc) => {
        const data = doc.data();

        // Safely parse timestamps regardless of string vs Firestore Timestamp object formats
        const date = data.createdAt?.toDate
          ? data.createdAt.toDate()
          : data.createdAt
            ? new Date(data.createdAt)
            : new Date();

        return {
          id: doc.id,
          ...data,
          displayDate: date.toLocaleString(),
        };
      });

      setRequests([...formattedOffline, ...onlineData]);
    } catch (error) {
      console.error(
        "Error fetching history history tracking data logs:",
        error,
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const renderItem = ({ item }: { item: any }) => {
    const currentStatus = item.status?.toLowerCase() || "pending";
    // Fixed: Fallback onto default style options objects if status layout doesn't map directly
    const statusConfig = STATUS_STYLES[currentStatus] || DEFAULT_STATUS_STYLE;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.serviceTitle}>
            {item.serviceType || "Unknown Service"}
          </Text>
          <View
            style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}
          >
            <Text style={[styles.statusText, { color: statusConfig.text }]}>
              {statusConfig.label || item.status || "Pending"}
            </Text>
          </View>
        </View>

        <Text style={styles.addressText} numberOfLines={1}>
          <MaterialCommunityIcons name="map-marker" size={14} color="gray" />{" "}
          {item.address || "No Location Specified"}
        </Text>

        <Text style={styles.dateText}>
          {item.displayDate ||
            (item.createdAt ? new Date(item.createdAt).toLocaleString() : "")}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="My Requests" />
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#ff6b1a"
          style={{ marginTop: 50 }}
        />
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No requests found.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  listContent: { padding: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#eee",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  serviceTitle: { fontSize: 16, fontWeight: "bold" },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  statusText: { fontSize: 11, fontWeight: "bold", textTransform: "uppercase" },
  addressText: { color: "gray", fontSize: 13, marginBottom: 5 },
  dateText: { color: "#999", fontSize: 11 },
  emptyText: { textAlign: "center", color: "gray", marginTop: 50 },
});
