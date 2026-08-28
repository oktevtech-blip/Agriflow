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
import { Truck, MapPin, Package, ChevronRight, Navigation, Clock, CheckCircle2 } from 'lucide-react-native';
import { theme } from '@/theme';
import { api } from '@/services/api';
import type { Delivery } from '@/types';
import { formatNumber, formatDate, formatDateTime, deliveryStatusMeta } from '@/services/format';
import { Card, StatusBadge, LoadingView, EmptyView } from '@/components';
import type { RootStackParamList } from '@/navigation/RootNavigator';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export function DeliveriesScreen() {
  const navigation = useNavigation<NavProp>();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const d = await api.getDeliveries();
    setDeliveries(d);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <LoadingView />;

  const active = deliveries.filter((d) => d.status !== 'delivered');
  const completed = deliveries.filter((d) => d.status === 'delivered');

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={theme.colors.brand[600]} />}
    >
      {/* Pipeline overview */}
      <View style={styles.pipelineCard}>
        {(['assigned', 'pickup', 'in_transit', 'delivered'] as const).map((s, i, arr) => {
          const meta = deliveryStatusMeta[s];
          const count = deliveries.filter((d) => d.status === s).length;
          const icons = [Package, Clock, Navigation, CheckCircle2];
          const Icon = icons[i];
          return (
            <View key={s} style={styles.pipelineStep}>
              <View style={styles.pipelineCircle}>
                <Icon size={18} color={i === 3 ? theme.colors.brand[600] : i === 2 ? theme.colors.indigo[500] : i === 1 ? theme.colors.sun[600] : theme.colors.earth[500]} />
              </View>
              <Text style={styles.pipelineLabel}>{meta.label}</Text>
              <Text style={styles.pipelineCount}>{count}</Text>
              {i < arr.length - 1 && <View style={styles.pipelineLine} />}
            </View>
          );
        })}
      </View>

      {/* Active deliveries */}
      {active.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active</Text>
          {active.map((d) => {
            const meta = deliveryStatusMeta[d.status];
            return (
              <Pressable
                key={d.id}
                onPress={() => navigation.navigate('DeliveryDetail', { deliveryId: d.id })}
                style={({ pressed }) => pressed ? styles.pressed : undefined}
              >
                <Card style={styles.deliveryCard}>
                  <View style={styles.deliveryHeader}>
                    <View style={styles.deliveryIcon}>
                      <Truck size={18} color={theme.colors.indigo[500]} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.deliveryCrop}>{d.cropName}</Text>
                      <Text style={styles.deliveryTransporter}>{d.transporterName} · {d.vehicleType}</Text>
                    </View>
                    <StatusBadge label={meta.label} bg={meta.bg} text={meta.text} dot={meta.dot} />
                  </View>

                  <View style={styles.routeContainer}>
                    <View style={styles.routePoint}>
                      <View style={[styles.routeDot, { backgroundColor: theme.colors.brand[600] }]} />
                      <Text style={styles.routeText}>{d.pickupLocation}</Text>
                    </View>
                    <View style={styles.routeConnector} />
                    <View style={styles.routePoint}>
                      <View style={[styles.routeDot, { backgroundColor: theme.colors.sky[600] }]} />
                      <Text style={styles.routeText}>{d.deliveryLocation}</Text>
                    </View>
                  </View>

                  <View style={styles.deliveryFooter}>
                    <View style={styles.deliveryMeta}>
                      <Clock size={14} color={theme.colors.earth[400]} />
                      <Text style={styles.deliveryMetaText}>ETA {formatDate(d.estimatedDelivery)}</Text>
                    </View>
                    <ChevronRight size={18} color={theme.colors.earth[300]} />
                  </View>
                </Card>
              </Pressable>
            );
          })}
        </View>
      )}

      {/* Completed deliveries */}
      {completed.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Completed</Text>
          {completed.map((d) => {
            const meta = deliveryStatusMeta[d.status];
            return (
              <Pressable
                key={d.id}
                onPress={() => navigation.navigate('DeliveryDetail', { deliveryId: d.id })}
                style={({ pressed }) => pressed ? styles.pressed : undefined}
              >
                <Card style={styles.deliveryCard}>
                  <View style={styles.deliveryHeader}>
                    <View style={styles.deliveryIcon}>
                      <CheckCircle2 size={18} color={theme.colors.brand[600]} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.deliveryCrop}>{d.cropName}</Text>
                      <Text style={styles.deliveryTransporter}>{d.transporterName}</Text>
                    </View>
                    <StatusBadge label={meta.label} bg={meta.bg} text={meta.text} dot={meta.dot} />
                  </View>
                  <View style={styles.deliveryFooter}>
                    <Text style={styles.deliveryMetaText}>Delivered {formatDate(d.deliveredAt)}</Text>
                    <ChevronRight size={18} color={theme.colors.earth[300]} />
                  </View>
                </Card>
              </Pressable>
            );
          })}
        </View>
      )}

      {deliveries.length === 0 && (
        <EmptyView icon={<Truck size={28} color={theme.colors.earth[400]} />} title="No deliveries" subtitle="Your deliveries will appear here once assigned." />
      )}
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.xl },
  pipelineCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  pipelineStep: { flex: 1, alignItems: 'center', position: 'relative' },
  pipelineCircle: { width: 44, height: 44, borderRadius: theme.radius.md, backgroundColor: theme.colors.earth[50], justifyContent: 'center', alignItems: 'center' },
  pipelineLabel: { fontSize: theme.fontSize.xs, fontWeight: theme.fontWeight.semibold, color: theme.colors.earth[600], marginTop: 6 },
  pipelineCount: { fontSize: theme.fontSize.xs, color: theme.colors.earth[400], marginTop: 2 },
  pipelineLine: { position: 'absolute', top: 22, right: -theme.spacing.lg / 2, width: theme.spacing.lg, height: 2, backgroundColor: theme.colors.earth[200] },
  section: { marginBottom: theme.spacing.lg },
  sectionTitle: { fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.bold, color: theme.colors.textPrimary, marginBottom: theme.spacing.sm },
  deliveryCard: { marginBottom: theme.spacing.md },
  deliveryHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.md },
  deliveryIcon: { width: 40, height: 40, borderRadius: theme.radius.md, backgroundColor: '#e0e7ff', justifyContent: 'center', alignItems: 'center', marginRight: theme.spacing.md },
  deliveryCrop: { fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.bold, color: theme.colors.textPrimary },
  deliveryTransporter: { fontSize: theme.fontSize.sm, color: theme.colors.earth[400], marginTop: 2 },
  routeContainer: { backgroundColor: theme.colors.earth[50], borderRadius: theme.radius.md, padding: theme.spacing.md, marginBottom: theme.spacing.md },
  routePoint: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  routeDot: { width: 10, height: 10, borderRadius: 5 },
  routeText: { fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.semibold, color: theme.colors.textPrimary },
  routeConnector: { width: 2, height: 16, backgroundColor: theme.colors.earth[200], marginLeft: 4 },
  deliveryFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: theme.spacing.sm, borderTopWidth: 1, borderTopColor: theme.colors.earth[100] },
  deliveryMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  deliveryMetaText: { fontSize: theme.fontSize.sm, color: theme.colors.earth[500] },
  pressed: { opacity: 0.7 },
});
