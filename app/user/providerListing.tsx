import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Provider = {
  id: string;
  name: string;
  eta: string;
  rating: number;
  price: string;
  phone: string;
  bgColor: string;
  iconColor: string;
};

const providers: Provider[] = [
  {
    id: "company2",
    name: "Company 2",
    eta: "10 minutes",
    rating: 5,
    price: "$30",
    phone: "0599999999",
    bgColor: "#FCE7F3",
    iconColor: "#6B7280",
  },
  {
    id: "company1",
    name: "Company 1",
    eta: "30 minutes",
    rating: 3,
    price: "$22",
    phone: "0598888888",
    bgColor: "#DBF3FF",
    iconColor: "#2563EB",
  },
  {
    id: "company3",
    name: "Company 3",
    eta: "25 minutes",
    rating: 3,
    price: "$15",
    phone: "0597777777",
    bgColor: "#FED7C2",
    iconColor: "#f07e41",
  },
];

export default function ProviderListing() {
  const { serviceTitle } = useLocalSearchParams();

  const handleRequest = (provider: Provider) => {
    router.push({
      pathname: "/request-progress" as any,
      params: {
        mode: "user",
        providerId: provider.id,
        providerName: provider.name,
        serviceTitle: serviceTitle ?? "",
      },
    });
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const renderStars = (rating: number) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <Ionicons
        key={star}
        name="star"
        size={16}
        color={star <= rating ? "#f07e41" : "#D1D5DB"}
      />
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={34} color="#fff" />
        </TouchableOpacity>

        

        
      </View>

      <View style={styles.sheet}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Provider Listing</Text>
          <View style={styles.divider} />

          {providers.map((provider) => (
            <View key={provider.id} style={styles.providerRow}>
              <View style={[styles.avatarBox, { backgroundColor: provider.bgColor }]}>
                <Ionicons
                  name="person-circle"
                  size={54}
                  color={provider.iconColor}
                />
              </View>

              <View style={styles.providerInfo}>
                <Text style={styles.providerName} numberOfLines={1}>
                  {provider.name}
                </Text>

                <Text style={styles.eta} numberOfLines={1}>
                  ETA : {provider.eta}
                </Text>

                <View style={styles.ratingPriceRow}>
                  <View style={styles.starsRow}>{renderStars(provider.rating)}</View>
                  <Text style={styles.price}>{provider.price}</Text>
                </View>
              </View>

              <View style={styles.buttonsWrap}>
                <TouchableOpacity
                  style={styles.requestButton}
                  onPress={() => handleRequest(provider)}
                >
                  <Text style={styles.requestText}>Request</Text>
                  <Ionicons name="chevron-forward" size={17} color="#2563EB" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.callButton}
                  onPress={() => handleCall(provider.phone)}
                >
                  <Text style={styles.callText}>Call</Text>
                  <Ionicons name="call" size={16} color="#EA580C" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const ORANGE = "#EA580C";
const BLUE = "#2563EB";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ORANGE,
  },

  header: {
    height: 230,
    backgroundColor: "#f07e41",
    paddingTop: 58,
    paddingHorizontal: 28,
  },

  backButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },

  bell: {
    position: "absolute",
    right: 34,
    top: 105,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 38,
  },

  sheet: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    paddingHorizontal: 22,
    paddingTop: 54,
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#111827",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginTop: 28,
  },

  providerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  avatarBox: {
    width: 76,
    height: 76,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  providerInfo: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },

  providerName: {
    fontSize: 21,
    fontWeight: "900",
    color: "#111827",
  },

  eta: {
    fontSize: 15,
    color: "#8B8B8B",
    marginTop: 4,
  },

  ratingPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 9,
  },

  starsRow: {
    flexDirection: "row",
    marginRight: 10,
  },

  price: {
    fontSize: 18,
    fontWeight: "900",
    color: ORANGE,
  },

  buttonsWrap: {
    width: 108,
    gap: 10,
    alignItems: "flex-end",
  },

  requestButton: {
    width: 104,
    height: 42,
    borderRadius: 21,
    borderWidth: 3,
    borderColor: BLUE,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },

  requestText: {
    fontSize: 13,
    fontWeight: "900",
    color: "#111827",
  },

  callButton: {
    width: 104,
    height: 42,
    borderRadius: 21,
    borderWidth: 3,
    borderColor: "#f07e41",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },

  callText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#111827",
  },
});