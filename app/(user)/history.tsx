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
import { db } from "../../services/firebaseConfig"; // Adjust based on your config path
import { getOfflineRequests } from "../../utils/offlineStorage"; // Your SQLite util

export default function HistoryScreen() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      // 1. Fetch Offline Requests from SQLite
      const offlineData = await getOfflineRequests();
      const formattedOffline = offlineData.map((req: any) => ({
        ...req,
        id: `offline-${req.id}`,
        status: "offline", // Special status for UI
      }));

      // 2. Fetch Online Requests from Firebase
      const q = query(
        collection(db, "requests"),
        where("userUID", "==", user.uid),
        orderBy("createdAt", "desc"),
      );
      const querySnapshot = await getDocs(q);
      const onlineData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const date = data.createdAt?.toDate
          ? data.createdAt.toDate()
          : new Date(data.createdAt);

        return {
          id: doc.id,
          ...data,
          displayDate: date.toLocaleString(), // Format it once here
        };
      });

      // Combine: Offline first, then Online
      setRequests([...formattedOffline, ...onlineData]);
    } catch (error) {
      console.error("Error fetching history:", error);
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

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.serviceTitle}>{item.serviceType}</Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                item.status === "offline" ? "#FFF3E0" : "#E8F5E9",
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: item.status === "offline" ? "#EF6C00" : "#2E7D32" },
            ]}
          >
            {item.status === "offline" ? "Waiting to Sync" : item.status}
          </Text>
        </View>
      </View>

      <Text style={styles.addressText} numberOfLines={1}>
        <MaterialCommunityIcons name="map-marker" size={14} color="gray" />{" "}
        {item.address}
      </Text>

      <Text style={styles.dateText}>
        {item.displayDate || new Date(item.createdAt).toLocaleString()}{" "}
      </Text>
    </View>
  );

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
    marginBottom: 10,
  },
  serviceTitle: { fontSize: 16, fontWeight: "bold" },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: "bold", textTransform: "uppercase" },
  addressText: { color: "gray", fontSize: 13, marginBottom: 5 },
  dateText: { color: "#999", fontSize: 11 },
  emptyText: { textAlign: "center", color: "gray", marginTop: 50 },
});
