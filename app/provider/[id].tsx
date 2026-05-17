import Header from "@/components/Header";
import {
  getUserExpoPushToken,
  sendExpoPushNotification,
} from "@/services/notificationService";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { db } from "../../services/firebaseConfig";

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return "0.0";
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2;

  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
};

const RequestDetails = () => {
  const [requestDetails, setRequestDetails] = useState<any>(null);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [providerDetails, setProviderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { id } = useLocalSearchParams();
  const docId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    const fetchData = async () => {
      if (!docId || docId === "[id]") {
        router.replace("/(user)" as any);
        return;
      }

      try {
        setLoading(true);

        const requestSnap = await getDoc(doc(db, "requests", docId));

        if (!requestSnap.exists()) {
          setRequestDetails(null);
          return;
        }

        const requestData = requestSnap.data();

        setRequestDetails({
          id: requestSnap.id,
          ...requestData,
        });

        if (requestData.userUID) {
          const userSnap = await getDoc(doc(db, "users", requestData.userUID));
          if (userSnap.exists()) setUserDetails(userSnap.data());
        }

        const providerId =
          requestData.providerUID || "5UsXtssp7ARLWUD0duBsntDu6H52";

        const providerSnap = await getDoc(doc(db, "providers", providerId));
        if (providerSnap.exists()) setProviderDetails(providerSnap.data());
      } catch (error) {
        console.error("Firestore Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [docId]);

  const handleStatusUpdate = async (newStatus: string) => {
    if (!docId || docId === "[id]") {
      alert("No request selected.");
      return;
    }

    try {
      await updateDoc(doc(db, "requests", docId), {
        status: newStatus,
      });

      if (newStatus === "accepted" && requestDetails?.userUID) {
        const userExpoPushToken = await getUserExpoPushToken(
          requestDetails.userUID
        );

        if (userExpoPushToken) {
          await sendExpoPushNotification(
            userExpoPushToken,
            "Request accepted",
            "Your provider accepted your request.",
            { requestId: docId }
          );
        }

        router.push({
          pathname: "/shared/request-progress" as any,
          params: {
            requestId: docId,
            mode: "provider",
          },
        });
      } else {
        router.back();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  const handleMakePhoneCall = (phoneNumber?: string) => {
    if (!phoneNumber) {
      alert("Phone number is missing.");
      return;
    }

    const cleanNumber = phoneNumber.replace(/[^+\d]/g, "");
    Linking.openURL(`tel:${cleanNumber}`).catch(() => {
      alert("Could not open phone dialer.");
    });
  };

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#FF8C00" style={styles.loader} />
    );
  }

  const userLat = requestDetails?.location?.latitude || 32.2226;
  const userLng = requestDetails?.location?.longitude || 35.2621;

  const providerLat =
    providerDetails?.location?._lat ||
    providerDetails?.location?.latitude ||
    userLat + 0.006;

  const providerLng =
    providerDetails?.location?._long ||
    providerDetails?.location?.longitude ||
    userLng + 0.006;

  const distance = calculateDistance(userLat, userLng, providerLat, providerLng);

  return (
    <View style={styles.screen}>
      <Header title="Request Details" showBackButton={true} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {requestDetails ? (
          <View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>{userDetails?.fullName || "Not Set"}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Status</Text>
              <Text style={styles.value}>{requestDetails.status}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Service type</Text>
              <Text style={styles.value}>{requestDetails.serviceType}</Text>
            </View>

            {requestDetails.serviceType === "Fuel Delivery" && (
              <>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Fuel Type</Text>
                  <Text style={styles.value}>
                    {requestDetails.details?.fuelType || "N/A"}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.label}>Fuel Quantity</Text>
                  <Text style={styles.value}>
                    {requestDetails.details?.quantity || "N/A"}
                  </Text>
                </View>
              </>
            )}

            {requestDetails.serviceType === "Tow Truck" && (
              <View style={styles.detailRow}>
                <Text style={styles.label}>Truck Size</Text>
                <Text style={styles.value}>
                  {requestDetails.details?.vehicleSize || "N/A"}
                </Text>
              </View>
            )}

            {requestDetails.serviceType === "Tire Service" && (
              <>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Vehicle Model</Text>
                  <Text style={styles.value}>
                    {requestDetails.details?.vehicleModel || "N/A"}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.label}>Tire Type</Text>
                  <Text style={styles.value}>
                    {requestDetails.details?.tireType || "N/A"}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.label}>Tire Numbers</Text>
                  <Text style={styles.value}>
                    {requestDetails.details?.tireCount || "1"}
                  </Text>
                </View>
              </>
            )}

            <View style={styles.detailRow}>
              <Text style={styles.label}>Phone</Text>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleMakePhoneCall(userDetails?.phoneNumber)}
                style={styles.phoneBadgeCapsuleButton}
              >
                <Text style={styles.phoneBadgeText}>
                  {userDetails?.phoneNumber || "No Phone"}
                </Text>
                <MaterialCommunityIcons
                  name="phone"
                  size={16}
                  color="#FF8C00"
                  style={styles.phoneIconIndent}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Created At</Text>
              <Text style={styles.value}>
                {requestDetails.createdAt?.toDate
                  ? requestDetails.createdAt.toDate().toLocaleString()
                  : typeof requestDetails.createdAt === "string"
                    ? new Date(requestDetails.createdAt).toLocaleString()
                    : "No Date"}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Address</Text>
              <Text style={styles.value}>{requestDetails.address || "No address"}</Text>
            </View>

            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                scrollEnabled={false}
                zoomEnabled={false}
                rotateEnabled={false}
                pitchEnabled={false}
                initialRegion={{
                  latitude: (userLat + providerLat) / 2,
                  longitude: (userLng + providerLng) / 2,
                  latitudeDelta: Math.abs(userLat - providerLat) * 2 || 0.02,
                  longitudeDelta: Math.abs(userLng - providerLng) * 2 || 0.02,
                }}
              >
                <Marker coordinate={{ latitude: userLat, longitude: userLng }}>
                  <View style={styles.customMarkerContainer}>
                    <View style={[styles.markerDot, { backgroundColor: "red" }]} />
                    <Text style={styles.markerLabelText}>
                      {userDetails?.fullName || "Client"}
                    </Text>
                  </View>
                </Marker>

                <Marker coordinate={{ latitude: providerLat, longitude: providerLng }}>
                  <View style={styles.customMarkerContainer}>
                    <View style={[styles.markerDot, { backgroundColor: "blue" }]} />
                    <Text style={styles.markerLabelText}>YOU</Text>
                  </View>
                </Marker>

                <Polyline
                  coordinates={[
                    { latitude: userLat, longitude: userLng },
                    { latitude: providerLat, longitude: providerLng },
                  ]}
                  strokeColor="#FF8C00"
                  strokeWidth={2.5}
                  lineDashPattern={[4, 4]}
                />
              </MapView>

              <View style={styles.distanceBadgeCapsule}>
                <Text style={styles.distanceCapsuleText}>{distance} km</Text>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              {requestDetails.status === "accepted" ? (
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/shared/request-progress" as any,
                      params: {
                        requestId: requestDetails.id,
                        mode: "provider",
                      },
                    })
                  }
                  style={styles.viewProgressBtn}
                >
                  <Text style={styles.btnText}>View Progress</Text>
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity
                    onPress={() => handleStatusUpdate("accepted")}
                    style={styles.accept}
                  >
                    <Text style={styles.btnText}>Accept Request</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleStatusUpdate("rejected")}
                    style={styles.reject}
                  >
                    <Text style={styles.btnText}>Reject Request</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        ) : (
          <Text style={styles.errorText}>Loading request failed.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: { padding: 20 },
  loader: { flex: 1, justifyContent: "center" },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    gap: 12,
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    width: 120,
  },

  value: {
    flex: 1,
    fontSize: 16,
    fontWeight: "400",
    color: "#444",
    textAlign: "right",
  },

  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 40,
  },

  phoneBadgeCapsuleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFE0B2",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FFB74D",
  },

  phoneBadgeText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },

  phoneIconIndent: {
    marginLeft: 8,
  },

  mapContainer: {
    height: 180,
    width: "100%",
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 25,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },

  map: {
    ...StyleSheet.absoluteFillObject,
  },

  customMarkerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  markerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#fff",
  },

  markerLabelText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#e65100",
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 2,
    overflow: "hidden",
  },

  distanceBadgeCapsule: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },

  distanceCapsuleText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "bold",
  },

  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
  },

  btnText: {
    color: "#fff",
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 16,
  },

  accept: {
    padding: 18,
    backgroundColor: "#FF8C00",
    borderRadius: 15,
    marginBottom: 15,
  },

  reject: {
    padding: 18,
    backgroundColor: "#cecdcb",
    borderRadius: 15,
  },

  viewProgressBtn: {
    padding: 18,
    backgroundColor: "#1E88E5",
    borderRadius: 15,
  },
});

export default RequestDetails;
