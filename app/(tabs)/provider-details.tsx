import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function ServiceTag({ title }: { title: string }) {
  return (
    <View style={styles.tag}>
      <Text style={styles.tagText}>{title}</Text>
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <TouchableOpacity style={styles.infoRow} activeOpacity={0.85}>
      <View style={styles.infoLeft}>
        <View style={styles.iconCircle}>
          <Ionicons name={icon} size={18} color="#ff7a1a" />
        </View>

        <View>
          <Text style={styles.infoLabel}>{label}</Text>
          <Text style={styles.infoValue}>{value}</Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#a1a1aa" />
    </TouchableOpacity>
  );
}

export default function ProviderDetailsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topDarkHeader}>
          <Text style={styles.headerTitle}>Request Details</Text>
          <Ionicons name="notifications" size={22} color="#fff" />
        </View>

        <View style={styles.mainContent}>
          <View style={styles.profileCard}>
            <View style={styles.profileTopRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>AN</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.name}>Ahmad Nassar</Text>
                <Text style={styles.role}>Roadside Assistance Specialist</Text>
                <Text style={styles.rating}>⭐ 4.9 • 183 reviews</Text>
              </View>
            </View>

            <View style={styles.miniStatsRow}>
              <View style={styles.miniStatBox}>
                <Text style={styles.miniLabel}>Distance</Text>
                <Text style={styles.miniValue}>2.3 km away</Text>
              </View>

              <View style={styles.miniStatBox}>
                <Text style={styles.miniLabel}>Jobs done</Text>
                <Text style={styles.miniValue}>248</Text>
              </View>
            </View>
          </View>

          <View style={styles.whiteCard}>
            <Text style={styles.sectionTitle}>About provider</Text>
            <Text style={styles.description}>
              Specialized in towing, battery support, tire change, lockout
              rescue, and quick roadside diagnostics.
            </Text>

            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Services</Text>

            <View style={styles.tagsWrap}>
              <ServiceTag title="Towing" />
              <ServiceTag title="Battery Jumpstart" />
              <ServiceTag title="Tire Change" />
              <ServiceTag title="Fuel Delivery" />
            </View>

            <View style={{ marginTop: 22, gap: 12 }}>
              <InfoRow
                icon="call"
                label="Phone"
                value="+970 59 000 1122"
              />
              <InfoRow
                icon="location"
                label="Current route"
                value="Heading to your location"
              />
              <InfoRow
                icon="time"
                label="Estimated arrival"
                value="12 minutes"
              />
            </View>

            <View style={styles.actionButtonsRow}>
              <TouchableOpacity style={styles.orangeButton} activeOpacity={0.85}>
                <Text style={styles.orangeButtonText}>Contact provider</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelButton} activeOpacity={0.85}>
                <Text style={styles.cancelButtonText}>Cancel request</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const ORANGE = '#ff7a1a';

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#ececec',
  },
  container: {
    flex: 1,
    backgroundColor: '#ececec',
  },
  topDarkHeader: {
    backgroundColor: '#0b1220',
    height: 110,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    paddingHorizontal: 20,
    paddingTop: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  mainContent: {
    paddingHorizontal: 16,
    marginTop: 14,
  },
  profileCard: {
    backgroundColor: '#11192d',
    borderRadius: 28,
    padding: 18,
  },
  profileTopRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 28,
  },
  name: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
  },
  role: {
    color: '#b8b8c0',
    fontSize: 14,
    marginTop: 4,
  },
  rating: {
    color: '#f4f4f5',
    fontSize: 14,
    marginTop: 10,
  },
  miniStatsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
  miniStatBox: {
    flex: 1,
    backgroundColor: '#232c3f',
    borderRadius: 18,
    padding: 14,
  },
  miniLabel: {
    color: '#a1a1aa',
    fontSize: 12,
    marginBottom: 4,
  },
  miniValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
  },
  whiteCard: {
    marginTop: 14,
    backgroundColor: '#f4f4f5',
    borderRadius: 28,
    padding: 18,
  },
  sectionTitle: {
    color: '#1f1f1f',
    fontSize: 24,
    fontWeight: '800',
  },
  description: {
    marginTop: 10,
    color: '#6b7280',
    fontSize: 16,
    lineHeight: 26,
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 14,
  },
  tag: {
    backgroundColor: '#ffe6d4',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  tagText: {
    color: ORANGE,
    fontWeight: '700',
    fontSize: 13,
  },
  infoRow: {
    backgroundColor: '#ebebee',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#f6f6f7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoLabel: {
    color: '#9ca3af',
    fontSize: 13,
  },
  infoValue: {
    color: '#18181b',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 2,
    width: '88%',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  orangeButton: {
    flex: 1,
    backgroundColor: ORANGE,
    borderRadius: 22,
    paddingVertical: 16,
    alignItems: 'center',
  },
  orangeButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    borderRadius: 22,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d4d4d8',
  },
  cancelButtonText: {
    color: '#222',
    fontWeight: '700',
    fontSize: 15,
  },
});