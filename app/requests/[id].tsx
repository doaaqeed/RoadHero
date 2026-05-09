import { router, useLocalSearchParams } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../services/firebaseConfig";

const RequestDetails = () => {
  const [requestDetails, setRequestDetails] = useState<any>(null);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useLocalSearchParams();

  const fetchData = async () => {
    try {
      setLoading(true);
      const docId = Array.isArray(id) ? id[0] : id;
      if (!docId || docId === "[id]") return;

      const requestRef = doc(db, "requests", docId);
      const requestSnap = await getDoc(requestRef);

      if (requestSnap.exists()) {
        const requestData = requestSnap.data();
        setRequestDetails({ id: requestSnap.id, ...requestData });

        if (requestData.userUID) {
          const userRef = doc(db, "users", requestData.userUID);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setUserDetails(userSnap.data());
          } else {
            console.log(
              `Path: users/${requestData.userUID} does not exist in Firestore.`,
            );
          }
        }
      }
    } catch (error) {
      console.error("Firestore Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading)
    return (
      <ActivityIndicator size="large" color="#FF8C00" style={styles.loader} />
    );

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      const docId = Array.isArray(id) ? id[0] : id;
      const requestRef = doc(db, "requests", docId);

      await updateDoc(requestRef, {
        status: newStatus,
      });

      if (newStatus === "accepted") {
        router.push("/request-progress");
      } else {
        router.back();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please try again.");
    }
  };
  return (
    <ScrollView style={styles.screen}>
      {requestDetails ? (
        <View style={styles.container}>
          <Text style={styles.title}>Request Details</Text>
          {userDetails ? (
            <View style={styles.detailRow}>
              <Text style={styles.label}>Name</Text>
              <View style={{ paddingLeft: 80 }}>
                <Text style={styles.value}>
                  {userDetails?.fullName || "Not Set"}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.card}>
              <Text style={styles.errorText}>
                User profile details not found in database.
              </Text>
            </View>
          )}
          <View style={styles.detailRow}>
            <Text style={styles.label}>Status</Text>
            <View style={{ paddingLeft: 75 }}>
              <Text style={styles.value}>{requestDetails.status}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Service type</Text>
            <View style={{ paddingLeft: 30 }}>
              <Text style={styles.value}>{requestDetails.serviceType}</Text>
            </View>
          </View>
          {requestDetails.serviceType === "Fuel Delivery" && (
            <View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Fuel Type</Text>
                <View style={{ paddingLeft: 50 }}>
                  <Text style={styles.value}>
                    {requestDetails.details?.fuelType}
                  </Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Fuel Quantity</Text>
                <View style={{ paddingLeft: 25 }}>
                  <Text style={styles.value}>
                    {requestDetails.details?.quantity}
                  </Text>
                </View>
              </View>
            </View>
          )}
          {requestDetails.serviceType === "Tow Truck" && (
            <View style={styles.detailRow}>
              <Text style={styles.label}>Truck Size</Text>
              <View style={{ paddingLeft: 30 }}>
                <Text style={styles.value}>
                  {requestDetails.details?.vehicleSize}
                </Text>
              </View>
            </View>
          )}
          {requestDetails.serviceType === "Tire Service" && (
            <View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Vehicle Model</Text>
                <View style={{ paddingLeft: 20 }}>
                  <Text style={styles.value}>
                    {requestDetails.details?.vehicleModel}
                  </Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Tire Type</Text>
                <View style={{ paddingLeft: 30 }}>
                  <Text style={styles.value}>
                    {requestDetails.details?.tireType}
                  </Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Tire Numbers</Text>
                <View style={{ paddingLeft: 30 }}>
                  <Text style={styles.value}>
                    {requestDetails.details?.tireCount}
                  </Text>
                </View>
              </View>
            </View>
          )}
          {requestDetails.serviceType === "Jump Start" && (
            <View style={styles.detailRow}>
              <Text style={styles.label}>Immediate assistance request</Text>
            </View>
          )}
          {requestDetails.serviceType === "On-site Mechanic" && (
            <View style={styles.detailRow}>
              <Text style={styles.label}>Immediate assistance request</Text>
            </View>
          )}
          <View style={styles.detailRow}>
            <Text style={styles.label}>Address</Text>
            <View style={{ paddingLeft: 60 }}></View>
            <Text style={[styles.value]}>{requestDetails.address}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Phone</Text>
            <View style={{ paddingLeft: 70 }}></View>
            <Text style={[styles.value]}>{userDetails?.phoneNumber}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Created At</Text>
            <View style={{ paddingLeft: 43 }}></View>
            <Text style={styles.value}>
              {requestDetails.createdAt?.toDate
                ? requestDetails.createdAt.toDate().toLocaleString()
                : "No Date"}
            </Text>
          </View>
          <View style={{ marginTop: 150 }}>
            <TouchableOpacity
              onPress={() => handleStatusUpdate("accepted")}
              style={styles.accept}
            >
              <Text
                style={{
                  color: "white",
                  alignSelf: "center",
                  fontWeight: "bold",
                }}
              >
                Accept Request
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleStatusUpdate("rejected")}
              style={styles.reject}
            >
              <Text
                style={{
                  color: "white",
                  alignSelf: "center",
                  fontWeight: "bold",
                }}
              >
                RejectRequest
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Text style={styles.errorText}>Loading request failed.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 20 },
  loader: { flex: 1, justifyContent: "center" },
  title: {
    marginTop: 50,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
    alignSelf: "center",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  value: {
    fontSize: 16,
    fontWeight: "400",
    color: "#444",
    textAlign: "right",
  },

  card: {
    padding: 15,
  },
  detailText: { fontSize: 16, color: "#444", marginBottom: 5 },
  errorText: { color: "red", textAlign: "center", marginTop: 20 },
  accept: {
    padding: 20,
    backgroundColor: "#FF8C00",
    borderRadius: 15,
  },
  reject: {
    padding: 20,
    marginTop: 20,
    backgroundColor: "#cecdcb",
    borderRadius: 15,
  },
});

export default RequestDetails;
