import { HelloWave } from "@/components/hello-wave";
import { sendServiceRequest } from "@/services/requestService";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { router, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

const services = [
  {
    id: 1,
    title: "Fuel Delivery",
    color: "#E9FCE9",
    icon: "gas-station",
    circle: "#C7FAC9",
    iconColor: "#4FBF67",
  },
  {
    id: 2,
    title: "Tow Truck",
    color: "#FCE9E9",
    icon: "truck",
    circle: "#FAC7C7",
    iconColor: "#F15757",
  },
  {
    id: 3,
    title: "Tire Repair or Replacement",
    color: "#E8F7FC",
    icon: "tire",
    circle: "#CBF0FB",
    iconColor: "#71D7F4",
  },
  {
    id: 4,
    title: "On-site Mechanic",
    color: "#FFFDCD",
    icon: "tools",
    circle: "#FFFA72",
    iconColor: "#FECB4C",
  },
  {
    id: 5,
    title: "Jump Start",
    color: "#FCF1EA",
    icon: "battery-charging",
    circle: "#FEDAC2",
    iconColor: "#FD914C",
  },
];

export default function HomeScreen() {
  const [locationName, setLocationName] = useState("Locating...");
  const [loading, setLoading] = useState(false);

  const [markerCoords, setMarkerCoords] = useState({
    latitude: 32.2211,
    longitude: 35.2544,
  });

  const [mapRegion, setMapRegion] = useState({
    latitude: 32.2211,
    longitude: 35.2544,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const fetchAddress = async (lat: number, lng: number) => {
    try {
      let reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lng,
      });
      if (reverseGeocode.length > 0) {
        let addr = reverseGeocode[0];
        setLocationName(
          `${addr.street || "Unknown Street"}, ${addr.city || "Nablus"}`,
        );
      }
    } catch (e) {
      setLocationName("Address not found");
    }
  };

  const handleAutoLocation = async () => {
    setLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Please allow location access to use this feature.",
      );
      setLoading(false);
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    const newPoint = { latitude, longitude };
    setMarkerCoords(newPoint);
    setMapRegion({ ...mapRegion, ...newPoint });
    await fetchAddress(latitude, longitude);
    setLoading(false);
  };

  useEffect(() => {
    handleAutoLocation();
  }, []);

  const handleMapPress = async (e: any) => {
    const pickedCoords = e.nativeEvent.coordinate;
    setMarkerCoords(pickedCoords);
    await fetchAddress(pickedCoords.latitude, pickedCoords.longitude);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          headerLeft: () => null,
        }}
      />
      <ScrollView style={styles.screen}>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Welcome </Text>
            <HelloWave />
          </View>
          <Text style={styles.smallTitle}>
            Do you need roadside assistance ?
          </Text>

          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              region={mapRegion}
              onRegionChangeComplete={(region) => setMapRegion(region)}
              onPress={handleMapPress}
            >
              <Marker coordinate={markerCoords} />
            </MapView>
            {loading && (
              <View style={styles.loader}>
                <ActivityIndicator size="large" color="#4FBF67" />
              </View>
            )}
          </View>

          <View style={styles.addressSection}>
            <View style={{ flex: 1 }}>
              <Text style={styles.addressLabel}>Your Current Address</Text>
              <View style={styles.addressRow}>
                <MaterialCommunityIcons
                  name="map-marker-radius"
                  size={26}
                  color="green"
                />
                <Text style={styles.addressText} numberOfLines={1}>
                  {locationName}
                </Text>
              </View>
            </View>
            <Pressable style={styles.changeButton} onPress={handleAutoLocation}>
              <Text style={styles.changeButtonText}>My Current Location</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.servicesGrid}>
          {services.map((item) => (
            <Pressable
              key={item.id}
              onPress={async () => {
                const locationParams = {
                  lat: markerCoords.latitude.toString(),
                  lng: markerCoords.longitude.toString(),
                  address: locationName,
                };

                if (item.title === "Fuel Delivery") {
                  router.push({
                    pathname: "/services/fuelService",
                    params: locationParams,
                  });
                } else if (item.title === "Tow Truck") {
                  router.push({
                    pathname: "/services/towService",
                    params: locationParams,
                  });
                } else if (item.title === "Tire Repair or Replacement") {
                  router.push({
                    pathname: "/services/tireService",
                    params: locationParams,
                  });
                } else {
                  Alert.alert(
                    "Confirm Request",
                    `Do you want to request ${item.title} to your current location?`,
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Confirm",
                        onPress: async () => {
                          try {
                            setLoading(true);
                            await sendServiceRequest(
                              item.title,
                              { note: "Immediate assistance requested" },
                              markerCoords,
                              locationName,
                            );
                            router.push("/waitingScreen");
                          } catch (error: any) {
                            Alert.alert(
                              "Error",
                              error.message || "Failed to send request",
                            );
                          } finally {
                            setLoading(false);
                          }
                        },
                      },
                    ],
                  );
                }
              }}
              style={({ pressed }) => [
                styles.card,
                { backgroundColor: item.color },
                pressed && { opacity: 0.7, transform: [{ scale: 0.96 }] },
              ]}
            >
              <View
                style={[styles.iconCircle, { backgroundColor: item.circle }]}
              >
                <MaterialCommunityIcons
                  name={item.icon as any}
                  size={28}
                  color={item.iconColor}
                />
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "white",
    flex: 1,
  },
  container: {
    marginTop: 60,
    paddingHorizontal: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
  },
  smallTitle: {
    color: "gray",
    fontSize: 18,
    marginTop: 5,
  },
  mapContainer: {
    marginTop: 20,
    height: 180,
    width: "100%",
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  map: { flex: 1 },
  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  addressSection: {
    marginVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addressLabel: { fontSize: 14, color: "grey" },
  addressRow: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  addressText: { fontSize: 14, fontWeight: "bold", marginLeft: 5, flex: 1 },
  changeButton: {
    borderColor: "#ccc",
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginLeft: 10,
  },
  changeButtonText: { color: "#666", fontWeight: "600", fontSize: 11 },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: 10,
    gap: 12,
    marginBottom: 30,
  },
  card: {
    padding: 10,
    borderRadius: 20,
    width: Dimensions.get("window").width / 3.5,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconCircle: {
    width: 55,
    height: 55,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    textAlign: "center",
    marginTop: 12,
    fontWeight: "bold",
    fontSize: 11,
  },
});
