import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <View style={styles.statCard}>
      <View style={styles.orangeSquare} />
      <Text style={styles.statNumber}>{number}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function QuickActionCard({ title }: { title: string }) {
  return (
    <TouchableOpacity style={styles.quickCard} activeOpacity={0.85}>
      <View style={styles.orangeSquare} />
      <Text style={styles.quickCardText}>{title}</Text>
    </TouchableOpacity>
  );
}

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topDarkHeader}>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Ionicons name="notifications" size={22} color="#fff" />
        </View>

        <View style={styles.mainContent}>
          <View style={styles.activeCard}>
            <View style={styles.activeTopRow}>
              <View>
                <Text style={styles.smallMuted}>Active request</Text>
                <Text style={styles.bigTitle}>Flat tire support</Text>
                <Text style={styles.smallMuted}>Toyota Corolla 2020</Text>
              </View>

              <View style={styles.etaBox}>
                <Text style={styles.etaLabel}>ETA</Text>
                <Text style={styles.etaValue}>12 min</Text>
              </View>
            </View>

            <View style={styles.infoPanel}>
              <Text style={styles.infoText}>📍 King George St, Jerusalem</Text>
              <Text style={styles.infoText}>🚚 Provider is on the way</Text>
              <Text style={styles.infoText}>👤 Provider: Ahmad Nassar</Text>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.orangeButton}
                activeOpacity={0.85}
              >
                <Text style={styles.orangeButtonText}>Track request</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.whiteButton} activeOpacity={0.85}>
                <Text style={styles.whiteButtonText}>Call provider</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.statsGrid}>
            <StatCard number="18" label="Total requests" />
            <StatCard number="14" label="Completed" />
            <StatCard number="6" label="Saved providers" />
            <StatCard number="2" label="Upcoming" />
          </View>

          <View style={styles.quickActionsSection}>
            <View style={styles.quickHeaderRow}>
              <View>
                <Text style={styles.sectionTitle}>Quick actions</Text>
                <Text style={styles.sectionSubtitle}>
                  The tiny command center
                </Text>
              </View>

              <View style={styles.tagBadge}>
                <Text style={styles.tagBadgeText}>RoadHero</Text>
              </View>
            </View>

            <View style={styles.quickGrid}>
              <QuickActionCard title="Request tow" />
              <QuickActionCard title="Report issue" />
              <QuickActionCard title="Emergency call" />
              <QuickActionCard title="Share location" />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const ORANGE = "#ff7a1a";
const DARK = "#0f1728";
const TEXT_MUTED = "#a3a3a3";
const SOFT = "#f4f4f5";

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#ececec" },
  container: { flex: 1 },
  topDarkHeader: {
    backgroundColor: "#0b1220",
    height: 110,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    paddingHorizontal: 20,
    paddingTop: 45,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "700" },
  mainContent: { paddingHorizontal: 16, marginTop: 14 },
  activeCard: { backgroundColor: DARK, borderRadius: 26, padding: 16 },
  activeTopRow: { flexDirection: "row", justifyContent: "space-between" },
  smallMuted: { color: TEXT_MUTED, fontSize: 13, marginBottom: 4 },
  bigTitle: { color: "#fff", fontSize: 26, fontWeight: "800" },
  etaBox: {
    backgroundColor: "#232c3f",
    borderRadius: 18,
    padding: 12,
    alignItems: "center",
  },
  etaLabel: { color: TEXT_MUTED, fontSize: 12 },
  etaValue: { color: "#fff", fontSize: 18, fontWeight: "800" },
  infoPanel: {
    backgroundColor: "#202837",
    borderRadius: 18,
    padding: 14,
    marginTop: 16,
    gap: 8,
  },
  infoText: { color: "#d4d4d8", fontSize: 14 },
  buttonRow: { flexDirection: "row", gap: 10, marginTop: 14 },
  orangeButton: {
    flex: 1,
    backgroundColor: ORANGE,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
  },
  orangeButtonText: { color: "#fff", fontWeight: "800" },
  whiteButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
  },
  whiteButtonText: { color: "#222", fontWeight: "800" },
  statsGrid: {
    marginTop: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  statCard: {
    width: "48%",
    backgroundColor: SOFT,
    borderRadius: 22,
    padding: 16,
    minHeight: 125,
    justifyContent: "space-between",
  },
  orangeSquare: {
    width: 18,
    height: 18,
    borderRadius: 5,
    backgroundColor: ORANGE,
    marginBottom: 12,
  },
  statNumber: { fontSize: 30, fontWeight: "800", color: "#171717" },
  statLabel: { fontSize: 14, color: "#8b8b8b" },
  quickActionsSection: {
    backgroundColor: SOFT,
    borderRadius: 24,
    padding: 16,
    marginTop: 16,
  },
  quickHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 22, fontWeight: "800", color: "#171717" },
  sectionSubtitle: { fontSize: 13, color: "#8b8b8b" },
  tagBadge: {
    backgroundColor: "#ffe4cf",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagBadgeText: { color: ORANGE, fontWeight: "700", fontSize: 12 },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  quickCard: {
    width: "48%",
    backgroundColor: "#ebebee",
    borderRadius: 18,
    padding: 14,
    minHeight: 100,
    justifyContent: "space-between",
  },
  quickCardText: { fontSize: 16, fontWeight: "800", color: "#171717" },
});
