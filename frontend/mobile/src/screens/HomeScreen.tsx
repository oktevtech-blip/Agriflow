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
import {
  Sprout,
  Wheat,
  ShoppingBag,
  Truck,
  Bell,
  TrendingUp,
  ChevronRight,
  MapPin,
  Calendar,
  Plus,
} from 'lucide-react-native';
import { theme } from '@/theme';
import { api, currentFarmer } from '@/services/api';
import type { Harvest, Order, Delivery, AppNotification } from '@/types';
import {
  formatNumber,
  formatWeight,
  formatCurrency,
  formatDate,
  timeAgo,
  harvestStatusMeta,
  orderStatusMeta,
  deliveryStatusMeta,
} from '@/services/format';
import { Card, StatusBadge, LoadingView } from '@/components';
import type { RootStackParamList } from '@/navigation/RootNavigator';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const navigation = useNavigation<NavProp>();
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    const [h, o, d, n] = await Promise.all([
      api.getHarvests(),
      api.getOrders(),
      api.getDeliveries(),
      api.getNotifications(),
    ]);
    setHarvests(h);
    setOrders(o);
    setDeliveries(d);
    setNotifications(n);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const totalYield = harvests
    .filter((h) => h.status === 'harvested')
    .reduce((s, h) => s + h.actualYieldKg, 0);
  const activeOrders = orders.filter((o) => !['delivered', 'cancelled'].includes(o.status)).length;
  const activeDeliveries = deliveries.filter((d) => d.status !== 'delivered').length;
  const readyCrops = harvests.filter((h) => h.status === 'ready');

  if (loading) return <LoadingView />;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} tintColor={theme.colors.brand[600]} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning</Text>
          <Text style={styles.farmerName}>{currentFarmer.name}</Text>
          <View style={styles.locationRow}>
            <MapPin size={13} color={theme.colors.earth[400]} />
            <Text style={styles.locationText}>{currentFarmer.location}</Text>
          </View>
        </View>
        <Pressable onPress={() => navigation.navigate('Profile')} style={styles.avatar}>
          <Text style={styles.avatarText}>
            {currentFarmer.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
          </Text>
        </Pressable>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <StatCard icon={<Wheat size={20} color={theme.colors.brand[600]} />} label="Total Yield" value={formatWeight(totalYield)} bg={theme.colors.brand[50]} />
        <StatCard icon={<ShoppingBag size={20} color={theme.colors.sky[600]} />} label="Active Orders" value={`${activeOrders}`} bg="#e0f2fe" />
        <StatCard icon={<Truck size={20} color={theme.colors.indigo[500]} />} label="Deliveries" value={`${activeDeliveries}`} bg="#e0e7ff" />
      </View>

      {/* Ready for harvest alert */}
      {readyCrops.length > 0 && (
        <Pressable
          onPress={() => navigation.navigate('RecordHarvest')}
          style={({ pressed }) => [styles.alertCard, pressed && styles.pressed]}
        >
          <View style={styles.alertIcon}>
            <Sprout size={22} color={theme.colors.sun[600]} />
          </View>
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>{readyCrops.length} crop{readyCrops.length > 1 ? 's' : ''} ready for harvest</Text>
            <Text style={styles.alertSubtitle}>Tap to record your harvest</Text>
          </View>
          <ChevronRight size={20} color={theme.colors.earth[400]} />
        </Pressable>
      )}

      {/* Quick actions */}
      <View style={styles.actionsRow}>
        <QuickAction icon={<Plus size={22} color={theme.colors.white} />} label="Record Harvest" onPress={() => navigation.navigate('RecordHarvest')} bg={theme.colors.brand[600]} />
        <QuickAction icon={<Bell size={22} color={theme.colors.white} />} label="Notifications" onPress={() => navigation.navigate('Profile')} bg={theme.colors.sky[600]} badge={unreadCount} />
      </View>

      {/* Current crops */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Crops</Text>
          <Pressable onPress={() => navigation.navigate('Farm')}>
            <Text style={styles.seeAll}>See all</Text>
          </Pressable>
        </View>
        {harvests.slice(0, 3).map((h) => {
          const meta = harvestStatusMeta[h.status];
          return (
            <Card key={h.id} style={styles.cropCard}>
              <View style={styles.cropIcon}>
                <Wheat size={18} color={theme.colors.brand[600]} />
              </View>
              <View style={styles.cropInfo}>
                <Text style={styles.cropName}>{h.cropName}</Text>
                <Text style={styles.cropMeta}>
                  {h.status === 'harvested' ? `${formatNumber(h.actualYieldKg)} kg` : `${formatNumber(h.expectedYieldKg)} kg expected`} · {formatDate(h.plantingDate)}
                </Text>
              </View>
              <StatusBadge label={meta.label} bg={meta.bg} text={meta.text} dot={meta.dot} />
            </Card>
          );
        })}
      </View>

      {/* Recent orders */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          <Pressable onPress={() => navigation.navigate('Orders')}>
            <Text style={styles.seeAll}>See all</Text>
          </Pressable>
        </View>
        {orders.slice(0, 2).map((o) => {
          const meta = orderStatusMeta[o.status];
          return (
            <Pressable
              key={o.id}
              onPress={() => navigation.navigate('OrderDetail', { orderId: o.id })}
              style={({ pressed }) => pressed ? styles.pressed : undefined}
            >
              <Card style={styles.orderCard}>
                <View style={styles.orderTop}>
                  <Text style={styles.orderCrop}>{o.cropName}</Text>
                  <StatusBadge label={meta.label} bg={meta.bg} text={meta.text} dot={meta.dot} />
                </View>
                <Text style={styles.orderBuyer}>{o.buyerName} · {o.buyerCompany}</Text>
                <View style={styles.orderBottom}>
                  <Text style={styles.orderQty}>{formatNumber(o.quantityKg)} kg · {formatCurrency(o.unitPrice)}/kg</Text>
                  <Text style={styles.orderTotal}>{formatCurrency(o.totalValue)}</Text>
                </View>
              </Card>
            </Pressable>
          );
        })}
      </View>

      {/* Active deliveries */}
      {deliveries.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Deliveries</Text>
            <Pressable onPress={() => navigation.navigate('Deliveries')}>
              <Text style={styles.seeAll}>See all</Text>
            </Pressable>
          </View>
          {deliveries.slice(0, 2).map((d) => {
            const meta = deliveryStatusMeta[d.status];
            return (
              <Pressable
                key={d.id}
                onPress={() => navigation.navigate('DeliveryDetail', { deliveryId: d.id })}
                style={({ pressed }) => pressed ? styles.pressed : undefined}
              >
                <Card style={styles.deliveryCard}>
                  <View style={styles.deliveryRoute}>
                    <View style={styles.routePoint}>
                      <MapPin size={14} color={theme.colors.brand[600]} />
                      <Text style={styles.routeText} numberOfLines={1}>{d.pickupLocation}</Text>
                    </View>
                    <View style={styles.routeLine} />
                    <View style={styles.routePoint}>
                      <MapPin size={14} color={theme.colors.sky[600]} />
                      <Text style={styles.routeText} numberOfLines={1}>{d.deliveryLocation}</Text>
                    </View>
                  </View>
                  <View style={styles.deliveryBottom}>
                    <Text style={styles.deliveryCrop}>{d.cropName} · {d.vehicleType}</Text>
                    <StatusBadge label={meta.label} bg={meta.bg} text={meta.text} dot={meta.dot} />
                  </View>
                </Card>
              </Pressable>
            );
          })}
        </View>
      )}

      {/* Recent notifications */}
      {notifications.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {notifications.slice(0, 3).map((n) => (
            <View key={n.id} style={styles.notifRow}>
              <View style={[styles.notifDot, { backgroundColor: n.read ? theme.colors.earth[200] : theme.colors.brand[500] }]} />
              <View style={styles.notifContent}>
                <Text style={styles.notifTitle}>{n.title}</Text>
                <Text style={styles.notifMessage} numberOfLines={2}>{n.message}</Text>
                <Text style={styles.notifTime}>{timeAgo(n.timestamp)}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

function StatCard({ icon, label, value, bg }: { icon: React.ReactNode; label: string; value: string; bg: string }) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: bg }]}>{icon}</View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function QuickAction({ icon, label, onPress, bg, badge }: { icon: React.ReactNode; label: string; onPress: () => void; bg: string; badge?: number }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.quickAction, { backgroundColor: bg }, pressed && styles.pressed]}>
      <View style={styles.quickActionIcon}>
        {icon}
        {badge !== undefined && badge > 0 && (
          <View style={styles.quickBadge}>
            <Text style={styles.quickBadgeText}>{badge}</Text>
          </View>
        )}
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.xl },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  greeting: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.earth[400],
    fontWeight: theme.fontWeight.medium,
  },
  farmerName: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.textPrimary,
    marginTop: 2,
  },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  locationText: { fontSize: theme.fontSize.sm, color: theme.colors.earth[400] },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.brand[600],
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: theme.colors.white, fontWeight: theme.fontWeight.bold, fontSize: theme.fontSize.sm },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    gap: 4,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  statValue: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  statLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.earth[400],
    fontWeight: theme.fontWeight.medium,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  alertIcon: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    backgroundColor: '#fde68a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContent: { flex: 1, marginLeft: theme.spacing.md },
  alertTitle: { fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.bold, color: theme.colors.sun[600] },
  alertSubtitle: { fontSize: theme.fontSize.sm, color: theme.colors.sun[500], marginTop: 2 },
  actionsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  quickAction: {
    flex: 1,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
    gap: 6,
  },
  quickActionIcon: { position: 'relative' },
  quickActionLabel: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.white,
  },
  quickBadge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: theme.colors.red[500],
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
  quickBadgeText: { color: theme.colors.white, fontSize: 10, fontWeight: theme.fontWeight.bold },
  section: { marginBottom: theme.spacing.xl },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  seeAll: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.brand[600],
    fontWeight: theme.fontWeight.semibold,
  },
  cropCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  cropIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.brand[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  cropInfo: { flex: 1, marginLeft: theme.spacing.md },
  cropName: { fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.bold, color: theme.colors.textPrimary },
  cropMeta: { fontSize: theme.fontSize.sm, color: theme.colors.earth[400], marginTop: 2 },
  orderCard: { marginBottom: theme.spacing.sm },
  orderTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  orderCrop: { fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.bold, color: theme.colors.textPrimary },
  orderBuyer: { fontSize: theme.fontSize.sm, color: theme.colors.earth[500], marginBottom: 8 },
  orderBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTopWidth: 1, borderTopColor: theme.colors.earth[100] },
  orderQty: { fontSize: theme.fontSize.sm, color: theme.colors.earth[500] },
  orderTotal: { fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.bold, color: theme.colors.brand[700] },
  deliveryCard: { marginBottom: theme.spacing.sm },
  deliveryRoute: { flexDirection: 'column', gap: 6, marginBottom: theme.spacing.sm },
  routePoint: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  routeText: { fontSize: theme.fontSize.sm, color: theme.colors.textPrimary, fontWeight: theme.fontWeight.semibold },
  routeLine: { width: 1, height: 12, backgroundColor: theme.colors.earth[200], marginLeft: 6 },
  deliveryBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTopWidth: 1, borderTopColor: theme.colors.earth[100] },
  deliveryCrop: { fontSize: theme.fontSize.sm, color: theme.colors.earth[500] },
  notifRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: theme.spacing.sm, gap: 10 },
  notifDot: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
  notifContent: { flex: 1 },
  notifTitle: { fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.semibold, color: theme.colors.textPrimary },
  notifMessage: { fontSize: theme.fontSize.sm, color: theme.colors.earth[500], marginTop: 2 },
  notifTime: { fontSize: theme.fontSize.xs, color: theme.colors.earth[400], marginTop: 4 },
  pressed: { opacity: 0.7 },
});
