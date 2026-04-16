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

function TimelineItem({
  title,
  time,
  done,
  last = false,
}: {
  title: string;
  time: string;
  done: boolean;
  last?: boolean;
}) {
  return (
    <View style={styles.timelineRow}>
      <View style={styles.timelineLeft}>
        <View style={[styles.dot, done ? styles.dotDone : styles.dotPending]}>
          {done ? (
            <Ionicons name="checkmark" size={16} color="#fff" />
          ) : (
            <View style={styles.innerPendingDot} />
          )}
        </View>
        {!last && <View style={[styles.line, done ? styles.lineDone : styles.linePending]} />}
      </View>

      <View style={styles.timelineTextWrap}>
        <Text style={styles.timelineTitle}>{title}</Text>
        <Text style={styles.timelineTime}>{time}</Text>
      </View>
    </View>
  );
}

export default function RequestProgressScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topDarkHeader}>
          <Text style={styles.headerTitle}>Request Tracking</Text>
          <Ionicons name="notifications" size={22} color="#fff" />
        </View>

        <View style={styles.mainContent}>
          <View style={styles.liveCard}>
            <View style={styles.liveRowTop}>
              <View>
                <Text style={styles.smallMuted}>Current status</Text>
                <Text style={styles.liveTitle}>Provider is on the way</Text>
              </View>

              <View style={styles.liveBadge}>
                <Text style={styles.liveBadgeText}>Live</Text>
              </View>
            </View>

            <View style={styles.progressBox}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Progress</Text>
                <Text style={styles.progressPercent}>60%</Text>
              </View>

              <View style={styles.progressTrack}>
                <View style={styles.progressFill} />
              </View>

              <Text style={styles.locationText}>📍 King George St, Jerusalem</Text>
            </View>
          </View>

          <View style={styles.timelineCard}>
            <View style={styles.timelineHeaderRow}>
              <View>
                <Text style={styles.sectionTitle}>Tracking timeline</Text>
                <Text style={styles.sectionSubtitle}>
                  Each stop on the little rescue railway
                </Text>
              </View>

              <View style={styles.ticketBadge}>
                <Text style={styles.ticketText}>#2084</Text>
              </View>
            </View>

            <View style={{ marginTop: 18 }}>
              <TimelineItem title="Request sent" time="09:10 AM" done />
              <TimelineItem title="Provider accepted" time="09:18 AM" done />
              <TimelineItem title="On the way" time="09:41 AM" done />
              <TimelineItem title="Arrived at location" time="ETA 7 min" done={false} />
              <TimelineItem title="Issue fixed" time="Pending" done={false} last />
            </View>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryTopRow}>
              <View>
                <Text style={styles.sectionTitle}>Provider summary</Text>
                <Text style={styles.sectionSubtitle}>Useful bits, no fluff confetti</Text>
              </View>

              <View style={styles.avatar}>
                <Text style={styles.avatarText}>AN</Text>
              </View>
            </View>

            <View style={styles.summaryGrid}>
              <View style={styles.summaryBox}>
                <Text style={styles.summaryBoxLabel}>Name</Text>
                <Text style={styles.summaryBoxValue}>Ahmad</Text>
              </View>

              <View style={styles.summaryBox}>
                <Text style={styles.summaryBoxLabel}>ETA</Text>
                <Text style={styles.summaryBoxValue}>12 min</Text>
              </View>

              <View style={styles.summaryBox}>
                <Text style={styles.summaryBoxLabel}>Vehicle</Text>
                <Text style={styles.summaryBoxValue}>Tow Van</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.callButton} activeOpacity={0.85}>
              <Text style={styles.callButtonText}>Call now</Text>
            </TouchableOpacity>
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
  liveCard: {
    backgroundColor: '#11192d',
    borderRadius: 26,
    padding: 16,
  },
  liveRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 14,
  },
  smallMuted: {
    color: '#a1a1aa',
    fontSize: 13,
    marginBottom: 4,
  },
  liveTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
    width: '85%',
  },
  liveBadge: {
    backgroundColor: ORANGE,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  liveBadgeText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 13,
  },
  progressBox: {
    marginTop: 16,
    backgroundColor: '#232c3f',
    borderRadius: 18,
    padding: 14,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    color: '#c9c9cf',
    fontSize: 14,
  },
  progressPercent: {
    color: '#d4d4d8',
    fontSize: 14,
    fontWeight: '700',
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#3a4255',
    marginTop: 12,
    overflow: 'hidden',
  },
  progressFill: {
    width: '60%',
    height: '100%',
    backgroundColor: ORANGE,
    borderRadius: 999,
  },
  locationText: {
    color: '#d4d4d8',
    marginTop: 14,
    fontSize: 14,
  },
  timelineCard: {
    marginTop: 16,
    backgroundColor: '#f4f4f5',
    borderRadius: 26,
    padding: 16,
  },
  timelineHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  sectionTitle: {
    color: '#171717',
    fontSize: 24,
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: '#8b8b8b',
    fontSize: 13,
    marginTop: 4,
  },
  ticketBadge: {
    backgroundColor: '#ffe4cf',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  ticketText: {
    color: ORANGE,
    fontWeight: '700',
    fontSize: 12,
  },
  timelineRow: {
    flexDirection: 'row',
    minHeight: 86,
  },
  timelineLeft: {
    width: 34,
    alignItems: 'center',
  },
  dot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotDone: {
    backgroundColor: ORANGE,
  },
  dotPending: {
    backgroundColor: '#e5e7eb',
  },
  innerPendingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#a1a1aa',
  },
  line: {
    width: 2,
    flex: 1,
    marginTop: 4,
  },
  lineDone: {
    backgroundColor: '#f5c39b',
  },
  linePending: {
    backgroundColor: '#d4d4d8',
  },
  timelineTextWrap: {
    flex: 1,
    paddingLeft: 14,
    paddingTop: 2,
  },
  timelineTitle: {
    color: '#18181b',
    fontSize: 18,
    fontWeight: '800',
  },
  timelineTime: {
    color: '#8b8b8b',
    fontSize: 14,
    marginTop: 4,
  },
  summaryCard: {
    marginTop: 16,
    backgroundColor: '#f4f4f5',
    borderRadius: 26,
    padding: 16,
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: ORANGE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 18,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: '#ebebee',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
  },
  summaryBoxLabel: {
    color: '#8b8b8b',
    fontSize: 12,
    marginBottom: 6,
  },
  summaryBoxValue: {
    color: '#171717',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  callButton: {
    marginTop: 16,
    backgroundColor: ORANGE,
    borderRadius: 22,
    paddingVertical: 17,
    alignItems: 'center',
  },
  callButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
});