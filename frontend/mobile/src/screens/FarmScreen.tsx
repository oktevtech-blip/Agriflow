import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Sprout, Plus, MapPin, Phone, Calendar, Wheat } from 'lucide-react-native';
import { theme } from '@/theme';
import { api, currentFarmer } from '@/services/api';
import type { Harvest } from '@/types';
import {
  formatNumber,
  formatDate,
  formatWeight,
  harvestStatusMeta,
} from '@/services/format';
import { Card, StatusBadge, LoadingView, EmptyView } from '@/components';
import type { RootStackParamList } from '@/navigation/RootNavigator';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export function FarmScreen() {
  const navigation = useNavigation<NavProp>();
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const h = await api.getHarvests();
    setHarvests(h);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const totalYield = harvests.filter((h) => h.status === 'harvested').reduce((s, h) => s + h.actualYieldKg, 0);
  const totalExpected = harvests.reduce((s, h) => s + h.expectedYieldKg, 0);
  const readyCount = harvests.filter((h) => h.status === 'ready').length;
  const growingCount = harvests.filter((h) => h.status === 'growing' || h.status === 'planted').length;

  if (loading) return <LoadingView />;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={theme.colors.brand[600]} />}
    >
      {/* Farm header card */}
      <View style={styles.farmHeader}>
        <View style={styles.farmHeaderTop}>
          <View style={styles.farmAvatar}>
            <Sprout size={28} color={theme.colors.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.farmTitle}>{currentFarmer.name}'s Farm</Text>
            <View style={styles.farmLocationRow}>
              <MapPin size={13} color={theme.colors.brand[100]} />
              <Text style={styles.farmLocation}>{currentFarmer.location}</Text>
            </View>
          </View>
        </View>
        <View style={styles.farmStats}>
          <FarmStat label="Size" value={`${formatNumber(currentFarmer.farmSizeHectares)} ha`} />
          <FarmStat label="Harvested" value={formatWeight(totalYield)} />
          <FarmStat label="Expected" value={formatWeight(totalExpected)} />
          <FarmStat label="Active Crops" value={`${harvests.length}`} />
        </View>
      </View>

      {/* Status summary */}
      <View style={styles.statusRow}>
        <StatusPill label="Ready" count={readyCount} color={theme.colors.sun[600]} bg="#fef3c7" />
        <StatusPill label="Growing" count={growingCount} color={theme.colors.sky[600]} bg="#e0f2fe" />
        <StatusPill label="Harvested" count={harvests.filter((h) => h.status === 'harvested').length} color={theme.colors.brand[600]} bg="#dcfce7" />
      </View>

      {/* Record harvest button */}
      <Pressable
        onPress={() => navigation.navigate('RecordHarvest')}
        style={({ pressed }) => [styles.recordBtn, pressed && styles.pressed]}
      >
        <Plus size={20} color={theme.colors.white} />
        <Text style={styles.recordBtnText}>Record Harvest</Text>
      </Pressable>

      {/* Crops list */}
      <Text style={styles.sectionTitle}>All Crops & Production</Text>
      {harvests.length === 0 ? (
        <EmptyView icon={<Wheat size={28} color={theme.colors.earth[400]} />} title="No crops yet" subtitle="Record a harvest to get started." />
      ) : (
        harvests.map((h) => {
          const meta = harvestStatusMeta[h.status];
          return (
            <Card key={h.id} style={styles.cropCard}>
              <View style={styles.cropCardHeader}>
                <View style={styles.cropIcon}>
                  <Wheat size={18} color={theme.colors.brand[600]} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cropName}>{h.cropName}</Text>
                  <Text style={styles.cropCategory}>{h.cropCategory}</Text>
                </View>
                <StatusBadge label={meta.label} bg={meta.bg} text={meta.text} dot={meta.dot} />
              </View>

              <View style={styles.cropDetails}>
                <DetailRow icon={<Calendar size={14} color={theme.colors.earth[400]} />} label="Planted" value={formatDate(h.plantingDate)} />
                <DetailRow icon={<Calendar size={14} color={theme.colors.earth[400]} />} label="Expected" value={formatDate(h.expectedHarvestDate)} />
                {h.actualHarvestDate && (
                  <DetailRow icon={<Calendar size={14} color={theme.colors.brand[600]} />} label="Harvested" value={formatDate(h.actualHarvestDate)} />
                )}
              </View>

              <View style={styles.yieldRow}>
                <View style={styles.yieldBox}>
                  <Text style={styles.yieldLabel}>Expected</Text>
                  <Text style={styles.yieldValue}>{formatNumber(h.expectedYieldKg)} kg</Text>
                </View>
                <View style={[styles.yieldBox, h.status === 'harvested' && styles.yieldBoxHarvested]}>
                  <Text style={[styles.yieldLabel, h.status === 'harvested' && styles.yieldLabelHarvested]}>Actual</Text>
                  <Text style={[styles.yieldValue, h.status === 'harvested' && styles.yieldValueHarvested]}>
                    {h.status === 'harvested' ? `${formatNumber(h.actualYieldKg)} kg` : '—'}
                  </Text>
                </View>
                {h.grade && (
                  <View style={styles.gradeBox}>
                    <Text style={styles.yieldLabel}>Grade</Text>
                    <Text style={styles.gradeValue}>{h.grade}</Text>
                  </View>
                )}
              </View>

              {h.notes && (
                <View style={styles.notesBox}>
                  <Text style={styles.notesText}>{h.notes}</Text>
                </View>
              )}
            </Card>
          );
        })
      )}
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

function FarmStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.farmStat}>
      <Text style={styles.farmStatValue}>{value}</Text>
      <Text style={styles.farmStatLabel}>{label}</Text>
    </View>
  );
}

function StatusPill({ label, count, color, bg }: { label: string; count: number; color: string; bg: string }) {
  return (
    <View style={[styles.statusPill, { backgroundColor: bg }]}>
      <Text style={[styles.statusPillCount, { color }]}>{count}</Text>
      <Text style={[styles.statusPillLabel, { color }]}>{label}</Text>
    </View>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      {icon}
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.xl },
  farmHeader: {
    backgroundColor: theme.colors.brand[600],
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  farmHeaderTop: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.lg },
  farmAvatar: {
    width: 52,
    height: 52,
    borderRadius: theme.radius.lg,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  farmTitle: { fontSize: theme.fontSize.xl, fontWeight: theme.fontWeight.extrabold, color: theme.colors.white },
  farmLocationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  farmLocation: { fontSize: theme.fontSize.sm, color: theme.colors.brand[100] },
  farmStats: { flexDirection: 'row', justifyContent: 'space-between' },
  farmStat: { alignItems: 'center' },
  farmStatValue: { fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.bold, color: theme.colors.white },
  farmStatLabel: { fontSize: theme.fontSize.xs, color: theme.colors.brand[100], marginTop: 2 },
  statusRow: { flexDirection: 'row', gap: theme.spacing.sm, marginBottom: theme.spacing.lg },
  statusPill: { flex: 1, borderRadius: theme.radius.md, padding: theme.spacing.md, alignItems: 'center', gap: 2 },
  statusPillCount: { fontSize: theme.fontSize.xxl, fontWeight: theme.fontWeight.extrabold },
  statusPillLabel: { fontSize: theme.fontSize.xs, fontWeight: theme.fontWeight.semibold },
  recordBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.brand[600],
    borderRadius: theme.radius.lg,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  recordBtnText: { fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.bold, color: theme.colors.white },
  sectionTitle: { fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.bold, color: theme.colors.textPrimary, marginBottom: theme.spacing.sm },
  cropCard: { marginBottom: theme.spacing.md },
  cropCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.md },
  cropIcon: { width: 40, height: 40, borderRadius: theme.radius.md, backgroundColor: theme.colors.brand[50], justifyContent: 'center', alignItems: 'center', marginRight: theme.spacing.md },
  cropName: { fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.bold, color: theme.colors.textPrimary },
  cropCategory: { fontSize: theme.fontSize.xs, color: theme.colors.earth[400], marginTop: 2 },
  cropDetails: { gap: 6, marginBottom: theme.spacing.md },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  detailLabel: { fontSize: theme.fontSize.sm, color: theme.colors.earth[400], flex: 1 },
  detailValue: { fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.semibold, color: theme.colors.textPrimary },
  yieldRow: { flexDirection: 'row', gap: theme.spacing.sm, marginBottom: theme.spacing.md },
  yieldBox: { flex: 1, backgroundColor: theme.colors.earth[50], borderRadius: theme.radius.md, padding: theme.spacing.md, alignItems: 'center' },
  yieldBoxHarvested: { backgroundColor: theme.colors.brand[50] },
  yieldLabel: { fontSize: theme.fontSize.xs, color: theme.colors.earth[400], fontWeight: theme.fontWeight.medium },
  yieldLabelHarvested: { color: theme.colors.brand[600] },
  yieldValue: { fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.bold, color: theme.colors.textPrimary, marginTop: 2 },
  yieldValueHarvested: { color: theme.colors.brand[700] },
  gradeBox: { minWidth: 60, backgroundColor: theme.colors.sun[500] + '20', borderRadius: theme.radius.md, padding: theme.spacing.md, alignItems: 'center' },
  gradeValue: { fontSize: theme.fontSize.xl, fontWeight: theme.fontWeight.extrabold, color: theme.colors.sun[600], marginTop: 2 },
  notesBox: { backgroundColor: theme.colors.earth[50], borderRadius: theme.radius.md, padding: theme.spacing.md },
  notesText: { fontSize: theme.fontSize.sm, color: theme.colors.earth[500], fontStyle: 'italic' },
  pressed: { opacity: 0.7 },
});
