import { router, useLocalSearchParams } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { db } from "../../services/firebaseConfig";

export default function ServiceRequests() {
  const { serviceTitle } = useLocalSearchParams();

  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const q = query(
          collection(db, "requests"),
          where("serviceType", "==", String(serviceTitle))
        );

        const snapshot = await getDocs(q);

        const data: any[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const filtered = data.filter(
          (item) => item.status !== "fixed" && item.status !== "rejected"
        );

        setRequests(filtered);
      } catch (e) {
        console.log("ERROR:", e);
      }
    };

    if (serviceTitle) {
      loadRequests();
    }
  }, [serviceTitle]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{String(serviceTitle)}</Text>

      {requests.length === 0 ? (
        <Text style={styles.empty}>No requests yet</Text>
      ) : (
        requests.map((item) => (
          <Pressable
            key={item.id}
            style={styles.card}
            onPress={() => {
              router.push(`/provider/${item.id}` as any);
            }}
          >
            <Text style={styles.name}>{item.userEmail || "Unknown user"}</Text>

            <Text style={styles.text}>
              Address: {item.address || "No address"}
            </Text>

            <Text style={styles.text}>Status: {item.status}</Text>
          </Pressable>
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
    padding: 16,
    paddingBottom: 100,
  },

  title: {
    marginTop: 50,
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
    color: "#6B7280",
  },
});