import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Pressable,
} from 'react-native';
import { ShoppingBag, Sprout, Truck, Bell, Clock } from 'lucide-react-native';
import { theme } from '@/theme';
import { api } from '@/services/api';
import type { AppNotification } from '@/types';
import { timeAgo } from '@/services/format';
import { Card, LoadingView, EmptyView } from '@/components';

const typeIcons: Record<string, { icon: typeof ShoppingBag; bg: string; color: string }> = {
  order: { icon: ShoppingBag, bg: '#e0f2fe', color: theme.colors.sky[600] },
  harvest: { icon: Sprout, bg: '#dcfce7', color: theme.colors.brand[600] },
  delivery: { icon: Truck, bg: '#e0e7ff', color: theme.colors.indigo[500] },
  reminder: { icon: Clock, bg: '#fef3c7', color: theme.colors.sun[600] },
};

export function NotificationsScreen() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const n = await api.getNotifications();
    setNotifications(n);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const markRead = async (id: string) => {
    await api.markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  if (loading) return <LoadingView />;

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={theme.colors.brand[600]} />}
    >
      {unread > 0 && (
        <View style={styles.unreadBanner}>
          <Bell size={16} color={theme.colors.brand[700]} />
          <Text style={styles.unreadText}>{unread} unread notification{unread > 1 ? 's' : ''}</Text>
        </View>
      )}

      {notifications.length === 0 ? (
        <EmptyView icon={<Bell size={28} color={theme.colors.earth[400]} />} title="No notifications" subtitle="You're all caught up!" />
      ) : (
        notifications.map((n) => {
          const typeInfo = typeIcons[n.type] ?? typeIcons.reminder;
          const Icon = typeInfo.icon;
          return (
            <Pressable
              key={n.id}
              onPress={() => markRead(n.id)}
              style={({ pressed }) => pressed ? styles.pressed : undefined}
            >
              <Card style={[styles.notifCard, !n.read && styles.notifCardUnread]}>
                <View style={[styles.notifIcon, { backgroundColor: typeInfo.bg }]}>
                  <Icon size={20} color={typeInfo.color} />
                </View>
                <View style={styles.notifContent}>
                  <View style={styles.notifTop}>
                    <Text style={styles.notifTitle}>{n.title}</Text>
                    {!n.read && <View style={styles.unreadDot} />}
                  </View>
                  <Text style={styles.notifMessage}>{n.message}</Text>
                  <Text style={styles.notifTime}>{timeAgo(n.timestamp)}</Text>
                </View>
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
  unreadBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.brand[50],
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  unreadText: { fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.semibold, color: theme.colors.brand[700] },
  notifCard: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  notifCardUnread: {
    borderColor: theme.colors.brand[200],
    borderWidth: 1.5,
  },
  notifIcon: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  notifContent: { flex: 1 },
  notifTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  notifTitle: { fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.bold, color: theme.colors.textPrimary },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.brand[500] },
  notifMessage: { fontSize: theme.fontSize.sm, color: theme.colors.earth[500], marginTop: 4, lineHeight: 20 },
  notifTime: { fontSize: theme.fontSize.xs, color: theme.colors.earth[400], marginTop: 6 },
  pressed: { opacity: 0.7 },
});
