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
import type { Order } from '@/types';
import { formatNumber, formatCurrency, formatDate, formatDateTime, orderStatusMeta } from '@/services/format';
import { Card, StatusBadge, LoadingView } from '@/components';
import type { RootStackParamList } from '@/navigation/RootNavigator';

type NavProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'OrderDetail'>;

export function OrderDetailScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavProp>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const orders = await api.getOrders();
      const found = orders.find((o) => o.id === route.params.orderId);
      setOrder(found ?? null);
      setLoading(false);
    })();
  }, [route.params.orderId]);

  if (loading) return <LoadingView />;
  if (!order) return <View style={styles.center}><Text style={styles.notFound}>Order not found</Text></View>;

  const meta = orderStatusMeta[order.status];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Status banner */}
      <View style={[styles.statusBanner, { backgroundColor: meta.bg }]}>
        <StatusBadge label={meta.label} bg={theme.colors.white} text={meta.text} dot={meta.dot} />
        <Text style={styles.statusBannerTitle}>{order.cropName} Order</Text>
        <Text style={styles.statusBannerValue}>{formatCurrency(order.totalValue)}</Text>
      </View>

      {/* Order details */}
      <Card style={styles.detailCard}>
        <Text style={styles.cardTitle}>Order Information</Text>
        <DetailRow icon={<Package size={16} color={theme.colors.brand[600]} />} label="Crop" value={order.cropName} />
        <DetailRow icon={<Package size={16} color={theme.colors.earth[400]} />} label="Quantity" value={`${formatNumber(order.quantityKg)} kg`} />
        <DetailRow icon={<Package size={16} color={theme.colors.earth[400]} />} label="Unit Price" value={`${formatCurrency(order.unitPrice)}/kg`} />
        <DetailRow icon={<Clock size={16} color={theme.colors.earth[400]} />} label="Created" value={formatDate(order.createdAt)} />
      </Card>

      {/* Buyer info */}
      <Card style={styles.detailCard}>
        <Text style={styles.cardTitle}>Buyer</Text>
        <DetailRow icon={<User size={16} color={theme.colors.earth[400]} />} label="Name" value={order.buyerName} />
        <DetailRow icon={<Package size={16} color={theme.colors.earth[400]} />} label="Company" value={order.buyerCompany} />
      </Card>

      {/* Status flow */}
      <Card style={styles.detailCard}>
        <Text style={styles.cardTitle}>Order Progress</Text>
        <View style={styles.flowContainer}>
          {(['pending', 'confirmed', 'processing', 'in_transit', 'delivered'] as const).map((s, i, arr) => {
            const sMeta = orderStatusMeta[s];
            const isCurrent = order.status === s;
            const isPast = arr.indexOf(order.status as typeof arr[number]) > i;
            const isDone = isCurrent || isPast;
            return (
              <View key={s} style={styles.flowStep}>
                <View style={[styles.flowCircle, isDone && styles.flowCircleDone, isCurrent && styles.flowCircleCurrent]}>
                  <Text style={[styles.flowCircleText, isDone && styles.flowCircleTextDone]}>{i + 1}</Text>
                </View>
                <Text style={[styles.flowLabel, isDone && styles.flowLabelDone]}>{sMeta.label}</Text>
                {i < arr.length - 1 && <View style={[styles.flowLine, isPast && styles.flowLineDone]} />}
              </View>
            );
          })}
        </View>
      </Card>
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
  statusBanner: {
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    gap: 6,
  },
  statusBannerTitle: { fontSize: theme.fontSize.xl, fontWeight: theme.fontWeight.extrabold, color: theme.colors.textPrimary, marginTop: 4 },
  statusBannerValue: { fontSize: theme.fontSize.xxxl, fontWeight: theme.fontWeight.extrabold, color: theme.colors.brand[700] },
  detailCard: { marginBottom: theme.spacing.md },
  cardTitle: { fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.bold, color: theme.colors.textPrimary, marginBottom: theme.spacing.md },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 },
  detailLabel: { fontSize: theme.fontSize.sm, color: theme.colors.earth[400], flex: 1 },
  detailValue: { fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.semibold, color: theme.colors.textPrimary },
  flowContainer: { flexDirection: 'column', gap: 0 },
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
});
