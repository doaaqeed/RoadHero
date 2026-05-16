import {
  getUserExpoPushToken,
  sendExpoPushNotification,
} from "@/services/notificationService";
import Header from "@/components/Header";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Added to render the phone/call icon cleanly
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking, // Added to trigger native phone calls
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { db } from "../../services/firebaseConfig";

// 1. Helper function to calculate distance between two coordinates in kilometers
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return "0.0";
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d.toFixed(1);
};

// 2. Helper function to translate coordinates into a readable physical address
const getReadableAddress = async (
  lat: number,
  lon: number,
): Promise<string> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return "Location permission denied";
    }

    const response = await Location.reverseGeocodeAsync({
      latitude: lat,
      longitude: lon,
    });

    if (response && response.length > 0) {
      const addressObj = response[0];

      const street = addressObj.street || addressObj.name || "";
      const city = addressObj.city || addressObj.subregion || "";
      const region = addressObj.region || "";

      const formattedAddress = [street, city, region]
        .filter((item) => item.trim() !== "")
        .join(", ");

      return formattedAddress || "Address details unavailable";
    }

    return "No address found";
  } catch (error) {
    console.error("Reverse Geocoding Error:", error);
    return "Failed to resolve address";
  }
};

const RequestDetails = () => {
  const [requestDetails, setRequestDetails] = useState<any>(null);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [providerDetails, setProviderDetails] = useState<any>(null);
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

        setRequestDetails({
          id: requestSnap.id,
          ...requestData,
          createdAt: requestData.createdAt, // Keep original field data format intact
        });

        // Fetch User Details
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

        const providerId =
          requestData.providerUID || "5UsXtssp7ARLWUD0duBsntDu6H52";
        if (providerId) {
          const providerRef = doc(db, "providers", providerId);
          const providerSnap = await getDoc(providerRef);

          if (providerSnap.exists()) {
            const providerData = providerSnap.data();

            if (!providerData.address && providerData.location) {
              const lat =
                providerData.location._lat || providerData.location.latitude;
              const lon =
                providerData.location._long || providerData.location.longitude;

              if (lat && lon) {
                const humanReadableAddress = await getReadableAddress(lat, lon);
                providerData.address = humanReadableAddress;
              }
            }

            setProviderDetails(providerData);
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

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      const docId = Array.isArray(id) ? id[0] : id;

      if (!docId || docId === "[id]") {
        alert("No request selected.");
        return;
      }

      const requestRef = doc(db, "requests", docId);

      await updateDoc(requestRef, {
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
            {
              requestId: docId,
            }
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

  // Safe launcher wrapper function to initialize cellular phone system dialer applications
  const handleMakePhoneCall = (phoneNumber: string) => {
    if (!phoneNumber) {
      alert("Phone number is missing for this user.");
      return;
    }
    const cleanNumber = phoneNumber.replace(/[^+\d]/g, "");
    Linking.openURL(`tel:${cleanNumber}`).catch((err) => {
      console.error(
        "Failed to open phone dialer schema system application handler:",
        err,
      );
      alert("Could not trigger call service automatically on this device.");
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

  const distance = calculateDistance(
    userLat,
    userLng,
    providerLat,
    providerLng,
  );

  return (
    <View style={styles.screen}>
      <Header title="Request Details" showBackButton={true} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {requestDetails ? (
          <View>
            {/* Metadata Information Cards */}
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

            {/* Service Subtype Conditional Layout Data blocks */}
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
                <View style={{ paddingLeft: 45 }}>
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
                      {requestDetails.details?.vehicleModel || "N/A"}
                    </Text>
                  </View>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Tire Type</Text>
                  <View style={{ paddingLeft: 30 }}>
                    <Text style={styles.value}>
                      {requestDetails.details?.tireType || "N/A"}
                    </Text>
                  </View>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Tire Numbers</Text>
                  <View style={{ paddingLeft: 30 }}>
                    <Text style={styles.value}>
                      {requestDetails.details?.tireCount || "1"}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Phone Row Refactored into a customized clickable Phone Capsule Action Pill */}
            <View style={styles.detailRow}>
              <Text style={styles.label}>Phone</Text>
              <View style={{ flex: 1 }} />
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleMakePhoneCall(userDetails?.phoneNumber)}
                style={styles.phoneBadgeCapsuleButton}
              >
                <Text style={styles.phoneBadgeText}>
                  {userDetails?.phoneNumber || "No Phone Provided"}
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
              <View style={{ paddingLeft: 43 }} />
              <Text style={styles.value}>
                {requestDetails.createdAt?.toDate
                  ? requestDetails.createdAt.toDate().toLocaleString()
                  : typeof requestDetails.createdAt === "string"
                    ? new Date(requestDetails.createdAt).toLocaleString()
                    : "No Date"}
              </Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <Text style={styles.label}>Address</Text>
            <View style={{ paddingLeft: 60 }} />
            <Text style={styles.value}>{requestDetails.address}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Phone</Text>
            <View style={{ paddingLeft: 70 }} />
            <Text style={styles.value}>{userDetails?.phoneNumber}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Created At</Text>
            <View style={{ paddingLeft: 43 }} />
            <Text style={styles.value}>
              {requestDetails.createdAt?.toDate
                ? requestDetails.createdAt.toDate().toLocaleString()
                : "No Date"}
            </Text>
          </View>

            {/* Map Section Layout */}
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
                {/* User Marker */}
                <Marker coordinate={{ latitude: userLat, longitude: userLng }}>
                  <View style={styles.customMarkerContainer}>
                    <View
                      style={[styles.markerDot, { backgroundColor: "red" }]}
                    />
                    <Text style={styles.markerLabelText}>
                      {userDetails?.fullName || "Client"}
                    </Text>
                  </View>
                </Marker>

                {/* Provider Marker */}
                <Marker
                  coordinate={{ latitude: providerLat, longitude: providerLng }}
                >
                  <View style={styles.customMarkerContainer}>
                    <View
                      style={[styles.markerDot, { backgroundColor: "blue" }]}
                    />
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

              {/* Floating Distance Pill */}
              <View style={styles.distanceBadgeCapsule}>
                <Text style={styles.distanceCapsuleText}>{distance}km</Text>
              </View>
            </View>

            <View style={styles.addressSectionContainer}>
              <View style={styles.addressRow}>
                <View style={styles.circleIndicator} />
                <View style={styles.addressTextWrapper}>
                  <Text style={styles.addressLabelHeading}>User Location</Text>
                  <Text style={styles.addressContentText} numberOfLines={2}>
                    {requestDetails.address || "Unknown Location Address"}
                  </Text>
                </View>
              </View>

              <View style={styles.dashedLineSeparator} />

              <View style={styles.addressRow}>
                <View
                  style={[
                    styles.circleIndicator,
                    { backgroundColor: "#2E7D32" },
                  ]}
                />
                <View style={styles.addressTextWrapper}>
                  <Text style={styles.addressLabelHeading}>
                    Your Current Location
                  </Text>
                  <Text style={styles.addressContentText} numberOfLines={2}>
                    {providerDetails?.address ||
                      "Tracking provider location..."}
                  </Text>
                </View>
              </View>
            </View>

            {/* Bottom Interaction Control Buttons Block */}
            <View style={{ marginTop: 20, marginBottom: 40 }}>
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
                <View>
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
                </View>
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
  card: { padding: 15 },
  errorText: { color: "red", textAlign: "center", marginTop: 20 },
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

  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  map: { ...StyleSheet.absoluteFillObject },
  customMarkerContainer: { alignItems: "center", justifyContent: "center" },
  markerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#fff",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  markerLabelText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#e65100",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 2,
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
    overflow: "hidden",
  },
  distanceBadgeCapsule: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "#ffffff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  distanceCapsuleText: { color: "#000", fontSize: 14, fontWeight: "bold" },
  addressSectionContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginBottom: 15,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 6,
  },
  circleIndicator: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#FF8C00",
    marginTop: 4,
    marginRight: 12,
  },
  dashedLineSeparator: {
    width: 2,
    height: 20,
    borderWidth: 1,
    borderColor: "#bdbdbd",
    marginLeft: 6,
  },
  addressTextWrapper: { flex: 1 },
  addressLabelHeading: {
    fontSize: 12,
    color: "#888",
    fontWeight: "500",
    marginBottom: 2,
  },
  addressContentText: { fontSize: 15, color: "#222", fontWeight: "400" },
  btnText: {
    color: "white",
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  accept: { padding: 18, backgroundColor: "#FF8C00", borderRadius: 15 },
  reject: {
    padding: 18,
    marginTop: 15,
    backgroundColor: "#cecdcb",
    borderRadius: 15,
  },
  viewProgressBtn: {
    padding: 18,
    backgroundColor: "#1E88E5",
    borderRadius: 15,
  },
  // Stylings configured exclusively for matching the visual call capsule design specifications
  phoneBadgeCapsuleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFE0B2",
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 80,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FFB74D",
  },
  phoneBadgeText: {
    fontSize: 15,
    color: "#333333",
    fontWeight: "500",
  },
  phoneIconIndent: {
    marginLeft: 8,
  },
});

export default RequestDetails;
