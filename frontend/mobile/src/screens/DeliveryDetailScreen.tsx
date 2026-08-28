import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Pressable,
} from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MapPin, Truck, User, Phone, Package, Clock, Navigation, CheckCircle2 } from 'lucide-react-native';
import { theme } from '@/theme';
import { api } from '@/services/api';
import type { Delivery } from '@/types';
import { formatNumber, formatDate, formatDateTime, deliveryStatusMeta } from '@/services/format';
import { Card, StatusBadge, LoadingView } from '@/components';
import type { RootStackParamList } from '@/navigation/RootNavigator';

type NavProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'DeliveryDetail'>;

export function DeliveryDetailScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavProp>();
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const deliveries = await api.getDeliveries();
      const found = deliveries.find((d) => d.id === route.params.deliveryId);
      setDelivery(found ?? null);
      setLoading(false);
    })();
  }, [route.params.deliveryId]);

  if (loading) return <LoadingView />;
  if (!delivery) return <View style={styles.center}><Text style={styles.notFound}>Delivery not found</Text></View>;

  const meta = deliveryStatusMeta[delivery.status];
  const steps = ['assigned', 'pickup', 'in_transit', 'delivered'] as const;
  const currentIndex = steps.indexOf(delivery.status);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Route visualization */}
      <View style={styles.routeCard}>
        <View style={styles.routeSection}>
          <View style={[styles.routeIcon, { backgroundColor: theme.colors.brand[100] }]}>
            <MapPin size={20} color={theme.colors.brand[600]} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.routeLabel}>Pickup</Text>
            <Text style={styles.routeLocation}>{delivery.pickupLocation}</Text>
            {delivery.pickedUpAt && (
              <Text style={styles.routeTime}>Picked up {formatDateTime(delivery.pickedUpAt)}</Text>
            )}
          </View>
        </View>

        <View style={styles.routeLine} />

        <View style={styles.routeSection}>
          <View style={[styles.routeIcon, { backgroundColor: '#e0f2fe' }]}>
            <Navigation size={20} color={theme.colors.sky[600]} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.routeLabel}>Destination</Text>
            <Text style={styles.routeLocation}>{delivery.deliveryLocation}</Text>
            {delivery.deliveredAt && (
              <Text style={styles.routeTime}>Delivered {formatDateTime(delivery.deliveredAt)}</Text>
            )}
          </View>
        </View>
      </View>

      {/* Status badge */}
      <View style={styles.statusRow}>
        <StatusBadge label={meta.label} bg={meta.bg} text={meta.text} dot={meta.dot} />
        <Text style={styles.etaText}>ETA {formatDate(delivery.estimatedDelivery)}</Text>
      </View>

      {/* Transporter info */}
      <Card style={styles.detailCard}>
        <Text style={styles.cardTitle}>Transporter</Text>
        <DetailRow icon={<Truck size={16} color={theme.colors.indigo[500]} />} label="Driver" value={delivery.transporterName} />
        <DetailRow icon={<Package size={16} color={theme.colors.earth[400]} />} label="Vehicle" value={delivery.vehicleType} />
      </Card>

      {/* Cargo info */}
      <Card style={styles.detailCard}>
        <Text style={styles.cardTitle}>Cargo</Text>
        <DetailRow icon={<Package size={16} color={theme.colors.brand[600]} />} label="Crop" value={delivery.cropName} />
      </Card>

      {/* Progress tracker */}
      <Card style={styles.detailCard}>
        <Text style={styles.cardTitle}>Delivery Progress</Text>
        <View style={styles.flowContainer}>
          {steps.map((s, i) => {
            const sMeta = deliveryStatusMeta[s];
            const isCurrent = i === currentIndex;
            const isPast = i < currentIndex;
            const isDone = isCurrent || isPast;
            return (
              <View key={s} style={styles.flowStep}>
                <View style={[styles.flowCircle, isDone && styles.flowCircleDone, isCurrent && styles.flowCircleCurrent]}>
                  <Text style={[styles.flowCircleText, isDone && styles.flowCircleTextDone]}>{i + 1}</Text>
                </View>
                <Text style={[styles.flowLabel, isDone && styles.flowLabelDone]}>{sMeta.label}</Text>
                {i < steps.length - 1 && <View style={[styles.flowLine, isPast && styles.flowLineDone]} />}
              </View>
            );
          })}
        </View>
      </Card>

      {delivery.status === 'delivered' && (
        <View style={styles.deliveredBanner}>
          <CheckCircle2 size={24} color={theme.colors.brand[600]} />
          <Text style={styles.deliveredText}>Delivery completed successfully</Text>
        </View>
      )}
      <View style={{ height: 24 }} />
    </ScrollView>
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
  content: { paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.lg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  notFound: { fontSize: theme.fontSize.lg, color: theme.colors.earth[400] },
  routeCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  routeSection: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  routeIcon: { width: 44, height: 44, borderRadius: theme.radius.md, justifyContent: 'center', alignItems: 'center' },
  routeLabel: { fontSize: theme.fontSize.xs, color: theme.colors.earth[400], fontWeight: theme.fontWeight.medium },
  routeLocation: { fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.bold, color: theme.colors.textPrimary, marginTop: 2 },
  routeTime: { fontSize: theme.fontSize.sm, color: theme.colors.brand[600], marginTop: 4 },
  routeLine: { width: 2, height: 24, backgroundColor: theme.colors.earth[200], marginLeft: 21, marginVertical: 4 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.lg },
  etaText: { fontSize: theme.fontSize.sm, color: theme.colors.earth[500], fontWeight: theme.fontWeight.medium },
  detailCard: { marginBottom: theme.spacing.md },
  cardTitle: { fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.bold, color: theme.colors.textPrimary, marginBottom: theme.spacing.md },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 },
  detailLabel: { fontSize: theme.fontSize.sm, color: theme.colors.earth[400], flex: 1 },
  detailValue: { fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.semibold, color: theme.colors.textPrimary },
  flowContainer: { flexDirection: 'column' },
  flowStep: { flexDirection: 'row', alignItems: 'center', height: 48, position: 'relative' },
  flowCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: theme.colors.earth[100], justifyContent: 'center', alignItems: 'center', marginRight: theme.spacing.md, zIndex: 1 },
  flowCircleDone: { backgroundColor: theme.colors.brand[600] },
  flowCircleCurrent: { backgroundColor: theme.colors.brand[600], borderWidth: 3, borderColor: theme.colors.brand[200] },
  flowCircleText: { fontSize: theme.fontSize.xs, fontWeight: theme.fontWeight.bold, color: theme.colors.earth[400] },
  flowCircleTextDone: { color: theme.colors.white },
  flowLabel: { fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.medium, color: theme.colors.earth[400], flex: 1 },
  flowLabelDone: { color: theme.colors.textPrimary, fontWeight: theme.fontWeight.semibold },
  flowLine: { position: 'absolute', left: 13, top: 28, width: 2, height: 20, backgroundColor: theme.colors.earth[200] },
  flowLineDone: { backgroundColor: theme.colors.brand[500] },
  deliveredBanner: { flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'center', paddingVertical: theme.spacing.md, backgroundColor: theme.colors.brand[50], borderRadius: theme.radius.lg, marginTop: theme.spacing.sm },
  deliveredText: { fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.bold, color: theme.colors.brand[700] },
});
