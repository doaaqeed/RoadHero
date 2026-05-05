import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../services/firebaseConfig";

export default function ServiceRequests() {
  const { serviceTitle } = useLocalSearchParams();
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    const loadRequests = async () => {
      const q = query(
        collection(db, "requests"),
        where("serviceTitle", "==", serviceTitle),
        where("status", "==", "pending")
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRequests(data);
    };

    loadRequests();
  }, [serviceTitle]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{serviceTitle}</Text>

      {requests.length === 0 ? (
        <Text style={styles.empty}>No requests yet</Text>
      ) : (
        requests.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.name}>{item.userName || "Unknown user"}</Text>
            <Text style={styles.text}>
              Location: {item.location || "No location"}
            </Text>
            <Text style={styles.text}>Status: {item.status}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    padding: 70,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 20,
  },
  empty: {
    fontSize: 16,
    color: "#6B7280",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  text: {
    marginTop: 4,
    fontSize: 14,
    color: "#000104ff",
  },
});