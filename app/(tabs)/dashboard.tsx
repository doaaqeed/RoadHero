import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  Fuel,
  Truck,
  LifeBuoy,
  Wrench,
  Zap,
  CheckSquare,
  Bell,
  type LucideIcon,
} from "lucide-react-native";

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
      subtitle: ""
  },
  {
      title: "Tow Truck",

      Icon: Truck,
      bgColor: "#FEE2E2",
      iconColor: "#DC2626",
      subtitle: ""
  },
  {
      title: "Tire Repair & Replacement",

      Icon: LifeBuoy,
      bgColor: "#CFFAFE",
      iconColor: "#0891B2",
      subtitle: ""
  },
  {
      title: "On-Site Mechanic",

      Icon: Wrench,
      bgColor: "#FEF3C7",
      iconColor: "#D97706",
      subtitle: ""
  },
  {
      title: "Jump Start",

      Icon: Zap,
      bgColor: "#FFEDD5",
      iconColor: "#EA580C",
      subtitle: ""
  },
];

export default function Dashboard() {
  const [pressedCard, setPressedCard] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <Bell size={24} color="#fff" strokeWidth={2.2} />
      </View>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={styles.content}>
        {services.map(({ title, subtitle, Icon, bgColor, iconColor }) => (
          <TouchableOpacity
            key={title}
            style={[
              styles.card,
              pressedCard === title && styles.cardPressed,
            ]}
            activeOpacity={0.9}
            onPressIn={() => setPressedCard(title)}
            onPressOut={() => setPressedCard(null)}
          >
            <View style={[styles.iconBox, { backgroundColor: bgColor }]}>
              <Icon size={24} color={iconColor} strokeWidth={2.4} />
            </View>

           <Text style={styles.cardTitle}>{title}</Text>
          </TouchableOpacity>
        ))}

        {/* Completed */}
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
            <Text style={styles.cardSubtitle}>12 services this month</Text>
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

  
  header: {
    backgroundColor: "#EA580C",
    paddingTop: 60,
    paddingBottom: 50,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
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
    backgroundColor: "#cdf7c2ff",
    padding: 18,
    borderRadius: 18,
    marginTop: 10,
  },

  completedIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#f97316",
    alignItems: "center",
    justifyContent: "center",
  },
});