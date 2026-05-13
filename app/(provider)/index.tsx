import { router } from "expo-router";
import React, { useEffect, useState } from "react";

import {
  CheckSquare,
  Fuel,
  LifeBuoy,
  Truck,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react-native";

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Header from "@/components/Header";
import { db } from "@/services/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

type Service = {
  title: string;
  subtitle: string;
  Icon: LucideIcon;
  bgColor: string;
  iconColor: string;
};

const services: Service[] = [
  {
    title: "Fuel Delivery",
    Icon: Fuel,
    bgColor: "#DCFCE7",
    iconColor: "#16A34A",
    subtitle: "",
  },
  {
    title: "Tow Truck",
    Icon: Truck,
    bgColor: "#FEE2E2",
    iconColor: "#DC2626",
    subtitle: "",
  },
  {
    title: "Tire Service",
    Icon: LifeBuoy,
    bgColor: "#CFFAFE",
    iconColor: "#0891B2",
    subtitle: "",
  },
  {
    title: "On-site Mechanic",
    Icon: Wrench,
    bgColor: "#FEF3C7",
    iconColor: "#D97706",
    subtitle: "",
  },
  {
    title: "Jump Start",
    Icon: Zap,
    bgColor: "#FFEDD5",
    iconColor: "#EA580C",
    subtitle: "",
  },
];

export default function Dashboard() {
  const [pressedCard, setPressedCard] = useState<string | null>(null);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    const loadCompletedCount = async () => {
      try {
        const q = query(
          collection(db, "requests"),
          where("status", "==", "completed"),
        );

        const snapshot = await getDocs(q);
        setCompletedCount(snapshot.size);
      } catch (error) {
        console.log("Error loading completed count:", error);
      }
    };

    loadCompletedCount();
  }, []);

  return (
    <View style={styles.container}>
      <Header title="Dashboard" />

      <ScrollView contentContainerStyle={styles.content}>
        {services.map(({ title, Icon, bgColor, iconColor }) => (
          <TouchableOpacity
            key={title}
            style={[styles.card, pressedCard === title && styles.cardPressed]}
            activeOpacity={0.9}
            onPress={() =>
              router.push({
                pathname: "/provider/service-requests" as any,
                params: { serviceTitle: title },
              })
            }
          >
            <View style={[styles.iconBox, { backgroundColor: bgColor }]}>
              <Icon size={24} color={iconColor} strokeWidth={2.4} />
            </View>

            <Text style={styles.cardTitle}>{title}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[
            styles.completedCard,
            pressedCard === "completed" && styles.cardPressed,
          ]}
          onPressIn={() => setPressedCard("completed")}
          onPressOut={() => setPressedCard(null)}
        >
          <View style={styles.completedIcon}>
            <CheckSquare size={18} color="#ffffffff" strokeWidth={2.6} />
          </View>

          <View>
            <Text style={styles.cardTitle}>Completed</Text>
            <Text style={styles.cardSubtitle}>
              {completedCount} services this month
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
    gap: 12,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  cardPressed: {
    transform: [{ scale: 0.97 }],
    elevation: 1,
  },

  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },

  cardSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },

  completedCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#e3f7deff",
    padding: 18,
    borderRadius: 18,
    marginTop: 10,
  },

  completedIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#6ad457ff",
    alignItems: "center",
    justifyContent: "center",
  },
});
