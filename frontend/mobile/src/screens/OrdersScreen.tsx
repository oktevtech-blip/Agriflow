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
import { ShoppingBag, ChevronRight, User, Building2 } from 'lucide-react-native';
import { theme } from '@/theme';
import { api } from '@/services/api';
import type { Order, OrderStatus } from '@/types';
import { formatNumber, formatCurrency, formatDate, orderStatusMeta } from '@/services/format';
import { Card, StatusBadge, LoadingView, EmptyView } from '@/components';
import type { RootStackParamList } from '@/navigation/RootNavigator';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export function OrdersScreen() {
  const navigation = useNavigation<NavProp>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');

  const load = useCallback(async () => {
    const o = await api.getOrders();
    setOrders(o);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <LoadingView />;

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);
  const totalValue = orders.reduce((s, o) => s + o.totalValue, 0);
  const pendingCount = orders.filter((o) => o.status === 'pending').length;

  const tabs: { id: OrderStatus | 'all'; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'delivered', label: 'Delivered' },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={theme.colors.brand[600]} />}
    >
      {/* Summary */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{formatCurrency(totalValue)}</Text>
          <Text style={styles.summaryLabel}>Total Value</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{orders.length}</Text>
          <Text style={styles.summaryLabel}>Total Orders</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryValue, { color: theme.colors.sun[600] }]}>{pendingCount}</Text>
          <Text style={styles.summaryLabel}>Pending</Text>
        </View>
      </View>

      {/* Filter tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
        <View style={styles.tabsRow}>
          {tabs.map((t) => (
            <Pressable
              key={t.id}
              onPress={() => setFilter(t.id)}
              style={({ pressed }) => [
                styles.tab,
                filter === t.id && styles.tabActive,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.tabText, filter === t.id && styles.tabTextActive]}>{t.label}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <EmptyView icon={<ShoppingBag size={28} color={theme.colors.earth[400]} />} title="No orders" subtitle="Orders from buyers will appear here." />
      ) : (
        filtered.map((o) => {
          const meta = orderStatusMeta[o.status];
          return (
            <Pressable
              key={o.id}
              onPress={() => navigation.navigate('OrderDetail', { orderId: o.id })}
              style={({ pressed) => pressed ? styles.pressed : undefined}
            >
              <Card style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <View style={styles.orderIcon}>
                    <ShoppingBag size={18} color={theme.colors.brand[600]} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.orderCrop}>{o.cropName}</Text>
                    <Text style={styles.orderDate}>{formatDate(o.createdAt)}</Text>
                  </View>
                  <StatusBadge label={meta.label} bg={meta.bg} text={meta.text} dot={meta.dot} />
                </View>

                <View style={styles.orderBuyerRow}>
                  <User size={14} color={theme.colors.earth[400]} />
                  <Text style={styles.orderBuyerName}>{o.buyerName}</Text>
                </View>
                <View style={styles.orderBuyerRow}>
                  <Building2 size={14} color={theme.colors.earth[400]} />
                  <Text style={styles.orderCompany}>{o.buyerCompany}</Text>
                </View>

                <View style={styles.orderFooter}>
                  <View>
                    <Text style={styles.orderQty}>{formatNumber(o.quantityKg)} kg @ {formatCurrency(o.unitPrice)}/kg</Text>
                  </View>
                  <Text style={styles.orderTotal}>{formatCurrency(o.totalValue)}</Text>
                </View>
                <ChevronRight size={18} color={theme.colors.earth[300]} style={styles.chevron} />
              </Card>
            </Pressable>
          );
        })
      )}
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.xl },
  summaryRow: { flexDirection: 'row', gap: theme.spacing.sm, marginBottom: theme.spacing.lg },
  summaryCard: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    gap: 2,
  },
  summaryValue: { fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.extrabold, color: theme.colors.brand[700] },
  summaryLabel: { fontSize: theme.fontSize.xs, color: theme.colors.earth[400], fontWeight: theme.fontWeight.medium },
  tabsContainer: { marginBottom: theme.spacing.lg },
  tabsRow: { flexDirection: 'row', gap: theme.spacing.sm },
  tab: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.white,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
  },
  tabActive: { backgroundColor: theme.colors.brand[600], borderColor: theme.colors.brand[600] },
  tabText: { fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.semibold, color: theme.colors.earth[600] },
  tabTextActive: { color: theme.colors.white },
  orderCard: { marginBottom: theme.spacing.md, position: 'relative' },
  orderHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.sm },
  orderIcon: { width: 40, height: 40, borderRadius: theme.radius.md, backgroundColor: theme.colors.brand[50], justifyContent: 'center', alignItems: 'center', marginRight: theme.spacing.md },
  orderCrop: { fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.bold, color: theme.colors.textPrimary },
  orderDate: { fontSize: theme.fontSize.xs, color: theme.colors.earth[400], marginTop: 2 },
  orderBuyerRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  orderBuyerName: { fontSize: theme.fontSize.sm, color: theme.colors.earth[600], fontWeight: theme.fontWeight.medium },
  orderCompany: { fontSize: theme.fontSize.sm, color: theme.colors.earth[400] },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: theme.spacing.sm, marginTop: theme.spacing.sm, borderTopWidth: 1, borderTopColor: theme.colors.earth[100] },
  orderQty: { fontSize: theme.fontSize.sm, color: theme.colors.earth[500] },
  orderTotal: { fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.bold, color: theme.colors.brand[700] },
  chevron: { position: 'absolute', right: theme.spacing.md, bottom: theme.spacing.md },
  pressed: { opacity: 0.7 },
});
