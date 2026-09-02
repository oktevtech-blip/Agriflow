// // import React, { useEffect, useState, useCallback } from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   ScrollView,
// //   RefreshControl,
// //   Pressable,
// // } from 'react-native';
// // import { useNavigation } from '@react-navigation/native';
// // import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
// // import {
// //   Sprout,
// //   Wheat,
// //   ShoppingBag,
// //   Truck,
// //   Bell,
// //   TrendingUp,
// //   ChevronRight,
// //   MapPin,
// //   Calendar,
// //   Plus,
// // } from 'lucide-react-native';
// // import { theme } from '@/theme';
// // import { api, currentFarmer } from '@/services/api';
// // import type { Harvest, Order, Delivery, AppNotification } from '@/types';
// // import {
// //   formatNumber,
// //   formatWeight,
// //   formatCurrency,
// //   formatDate,
// //   timeAgo,
// //   harvestStatusMeta,
// //   orderStatusMeta,
// //   deliveryStatusMeta,
// // } from '@/services/format';
// // import { Card, StatusBadge, LoadingView } from '@/components';
// // import type { RootStackParamList } from '@/navigation/RootNavigator';

// // type NavProp = NativeStackNavigationProp<RootStackParamList>;

// // export function HomeScreen() {
// //   const navigation = useNavigation<NavProp>();
// //   const [harvests, setHarvests] = useState<Harvest[]>([]);
// //   const [orders, setOrders] = useState<Order[]>([]);
// //   const [deliveries, setDeliveries] = useState<Delivery[]>([]);
// //   const [notifications, setNotifications] = useState<AppNotification[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [refreshing, setRefreshing] = useState(false);

// //   const loadData = useCallback(async () => {
// //     const [h, o, d, n] = await Promise.all([
// //       api.getHarvests(),
// //       api.getOrders(),
// //       api.getDeliveries(),
// //       api.getNotifications(),
// //     ]);
// //     setHarvests(h);
// //     setOrders(o);
// //     setDeliveries(d);
// //     setNotifications(n);
// //     setLoading(false);
// //     setRefreshing(false);
// //   }, []);

// //   useEffect(() => {
// //     loadData();
// //   }, [loadData]);

// //   const unreadCount = notifications.filter((n) => !n.read).length;
// //   const totalYield = harvests
// //     .filter((h) => h.status === 'harvested')
// //     .reduce((s, h) => s + h.actualYieldKg, 0);
// //   const activeOrders = orders.filter((o) => !['delivered', 'cancelled'].includes(o.status)).length;
// //   const activeDeliveries = deliveries.filter((d) => d.status !== 'delivered').length;
// //   const readyCrops = harvests.filter((h) => h.status === 'ready');

// //   if (loading) return <LoadingView />;

// //   return (
// //     <ScrollView
// //       style={styles.container}
// //       contentContainerStyle={styles.content}
// //       refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} tintColor={theme.colors.brand[600]} />}
// //     >
// //       {/* Header */}
// //       <View style={styles.header}>
// //         <View>
// //           <Text style={styles.greeting}>Good morning</Text>
// //           <Text style={styles.farmerName}>{currentFarmer.name}</Text>
// //           <View style={styles.locationRow}>
// //             <MapPin size={13} color={theme.colors.earth[400]} />
// //             <Text style={styles.locationText}>{currentFarmer.location}</Text>
// //           </View>
// //         </View>
// //         <Pressable onPress={() => navigation.navigate('Profile')} style={styles.avatar}>
// //           <Text style={styles.avatarText}>
// //             {currentFarmer.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
// //           </Text>
// //         </Pressable>
// //       </View>

// //       {/* Stats */}
// //       <View style={styles.statsRow}>
// //         <StatCard icon={<Wheat size={20} color={theme.colors.brand[600]} />} label="Total Yield" value={formatWeight(totalYield)} bg={theme.colors.brand[50]} />
// //         <StatCard icon={<ShoppingBag size={20} color={theme.colors.sky[600]} />} label="Active Orders" value={`${activeOrders}`} bg="#e0f2fe" />
// //         <StatCard icon={<Truck size={20} color={theme.colors.indigo[500]} />} label="Deliveries" value={`${activeDeliveries}`} bg="#e0e7ff" />
// //       </View>

// //       {/* Ready for harvest alert */}
// //       {readyCrops.length > 0 && (
// //         <Pressable
// //           onPress={() => navigation.navigate('RecordHarvest')}
// //           style={({ pressed }) => [styles.alertCard, pressed && styles.pressed]}
// //         >
// //           <View style={styles.alertIcon}>
// //             <Sprout size={22} color={theme.colors.sun[600]} />
// //           </View>
// //           <View style={styles.alertContent}>
// //             <Text style={styles.alertTitle}>{readyCrops.length} crop{readyCrops.length > 1 ? 's' : ''} ready for harvest</Text>
// //             <Text style={styles.alertSubtitle}>Tap to record your harvest</Text>
// //           </View>
// //           <ChevronRight size={20} color={theme.colors.earth[400]} />
// //         </Pressable>
// //       )}

// //       {/* Quick actions */}
// //       <View style={styles.actionsRow}>
// //         <QuickAction icon={<Plus size={22} color={theme.colors.white} />} label="Record Harvest" onPress={() => navigation.navigate('RecordHarvest')} bg={theme.colors.brand[600]} />
// //         <QuickAction icon={<Bell size={22} color={theme.colors.white} />} label="Notifications" onPress={() => navigation.navigate('Profile')} bg={theme.colors.sky[600]} badge={unreadCount} />
// //       </View>

// //       {/* Current crops */}
// //       <View style={styles.section}>
// //         <View style={styles.sectionHeader}>
// //           <Text style={styles.sectionTitle}>My Crops</Text>
// //           <Pressable onPress={() => navigation.navigate('Farm')}>
// //             <Text style={styles.seeAll}>See all</Text>
// //           </Pressable>
// //         </View>
// //         {harvests.slice(0, 3).map((h) => {
// //           const meta = harvestStatusMeta[h.status];
// //           return (
// //             <Card key={h.id} style={styles.cropCard}>
// //               <View style={styles.cropIcon}>
// //                 <Wheat size={18} color={theme.colors.brand[600]} />
// //               </View>
// //               <View style={styles.cropInfo}>
// //                 <Text style={styles.cropName}>{h.cropName}</Text>
// //                 <Text style={styles.cropMeta}>
// //                   {h.status === 'harvested' ? `${formatNumber(h.actualYieldKg)} kg` : `${formatNumber(h.expectedYieldKg)} kg expected`} · {formatDate(h.plantingDate)}
// //                 </Text>
// //               </View>
// //               <StatusBadge label={meta.label} bg={meta.bg} text={meta.text} dot={meta.dot} />
// //             </Card>
// //           );
// //         })}
// //       </View>

// //       {/* Recent orders */}
// //       <View style={styles.section}>
// //         <View style={styles.sectionHeader}>
// //           <Text style={styles.sectionTitle}>Recent Orders</Text>
// //           <Pressable onPress={() => navigation.navigate('Orders')}>
// //             <Text style={styles.seeAll}>See all</Text>
// //           </Pressable>
// //         </View>
// //         {orders.slice(0, 2).map((o) => {
// //           const meta = orderStatusMeta[o.status];
// //           return (
// //             <Pressable
// //               key={o.id}
// //               onPress={() => navigation.navigate('OrderDetail', { orderId: o.id })}
// //               style={({ pressed }) => pressed ? styles.pressed : undefined}
// //             >
// //               <Card style={styles.orderCard}>
// //                 <View style={styles.orderTop}>
// //                   <Text style={styles.orderCrop}>{o.cropName}</Text>
// //                   <StatusBadge label={meta.label} bg={meta.bg} text={meta.text} dot={meta.dot} />
// //                 </View>
// //                 <Text style={styles.orderBuyer}>{o.buyerName} · {o.buyerCompany}</Text>
// //                 <View style={styles.orderBottom}>
// //                   <Text style={styles.orderQty}>{formatNumber(o.quantityKg)} kg · {formatCurrency(o.unitPrice)}/kg</Text>
// //                   <Text style={styles.orderTotal}>{formatCurrency(o.totalValue)}</Text>
// //                 </View>
// //               </Card>
// //             </Pressable>
// //           );
// //         })}
// //       </View>

// //       {/* Active deliveries */}
// //       {deliveries.length > 0 && (
// //         <View style={styles.section}>
// //           <View style={styles.sectionHeader}>
// //             <Text style={styles.sectionTitle}>Active Deliveries</Text>
// //             <Pressable onPress={() => navigation.navigate('Deliveries')}>
// //               <Text style={styles.seeAll}>See all</Text>
// //             </Pressable>
// //           </View>
// //           {deliveries.slice(0, 2).map((d) => {
// //             const meta = deliveryStatusMeta[d.status];
// //             return (
// //               <Pressable
// //                 key={d.id}
// //                 onPress={() => navigation.navigate('DeliveryDetail', { deliveryId: d.id })}
// //                 style={({ pressed }) => pressed ? styles.pressed : undefined}
// //               >
// //                 <Card style={styles.deliveryCard}>
// //                   <View style={styles.deliveryRoute}>
// //                     <View style={styles.routePoint}>
// //                       <MapPin size={14} color={theme.colors.brand[600]} />
// //                       <Text style={styles.routeText} numberOfLines={1}>{d.pickupLocation}</Text>
// //                     </View>
// //                     <View style={styles.routeLine} />
// //                     <View style={styles.routePoint}>
// //                       <MapPin size={14} color={theme.colors.sky[600]} />
// //                       <Text style={styles.routeText} numberOfLines={1}>{d.deliveryLocation}</Text>
// //                     </View>
// //                   </View>
// //                   <View style={styles.deliveryBottom}>
// //                     <Text style={styles.deliveryCrop}>{d.cropName} · {d.vehicleType}</Text>
// //                     <StatusBadge label={meta.label} bg={meta.bg} text={meta.text} dot={meta.dot} />
// //                   </View>
// //                 </Card>
// //               </Pressable>
// //             );
// //           })}
// //         </View>
// //       )}

// //       {/* Recent notifications */}
// //       {notifications.length > 0 && (
// //         <View style={styles.section}>
// //           <Text style={styles.sectionTitle}>Recent Activity</Text>
// //           {notifications.slice(0, 3).map((n) => (
// //             <View key={n.id} style={styles.notifRow}>
// //               <View style={[styles.notifDot, { backgroundColor: n.read ? theme.colors.earth[200] : theme.colors.brand[500] }]} />
// //               <View style={styles.notifContent}>
// //                 <Text style={styles.notifTitle}>{n.title}</Text>
// //                 <Text style={styles.notifMessage} numberOfLines={2}>{n.message}</Text>
// //                 <Text style={styles.notifTime}>{timeAgo(n.timestamp)}</Text>
// //               </View>
// //             </View>
// //           ))}
// //         </View>
// //       )}

// //       <View style={{ height: 24 }} />
// //     </ScrollView>
// //   );
// // }

// // function StatCard({ icon, label, value, bg }: { icon: React.ReactNode; label: string; value: string; bg: string }) {
// //   return (
// //     <View style={styles.statCard}>
// //       <View style={[styles.statIcon, { backgroundColor: bg }]}>{icon}</View>
// //       <Text style={styles.statValue}>{value}</Text>
// //       <Text style={styles.statLabel}>{label}</Text>
// //     </View>
// //   );
// // }

// // function QuickAction({ icon, label, onPress, bg, badge }: { icon: React.ReactNode; label: string; onPress: () => void; bg: string; badge?: number }) {
// //   return (
// //     <Pressable onPress={onPress} style={({ pressed }) => [styles.quickAction, { backgroundColor: bg }, pressed && styles.pressed]}>
// //       <View style={styles.quickActionIcon}>
// //         {icon}
// //         {badge !== undefined && badge > 0 && (
// //           <View style={styles.quickBadge}>
// //             <Text style={styles.quickBadgeText}>{badge}</Text>
// //           </View>
// //         )}
// //       </View>
// //       <Text style={styles.quickActionLabel}>{label}</Text>
// //     </Pressable>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: theme.colors.background },
// //   content: { paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.xl },
// //   header: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: theme.spacing.xl,
// //   },
// //   greeting: {
// //     fontSize: theme.fontSize.sm,
// //     color: theme.colors.earth[400],
// //     fontWeight: theme.fontWeight.medium,
// //   },
// //   farmerName: {
// //     fontSize: theme.fontSize.xxl,
// //     fontWeight: theme.fontWeight.extrabold,
// //     color: theme.colors.textPrimary,
// //     marginTop: 2,
// //   },
// //   locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
// //   locationText: { fontSize: theme.fontSize.sm, color: theme.colors.earth[400] },
// //   avatar: {
// //     width: 44,
// //     height: 44,
// //     borderRadius: 22,
// //     backgroundColor: theme.colors.brand[600],
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   avatarText: { color: theme.colors.white, fontWeight: theme.fontWeight.bold, fontSize: theme.fontSize.sm },
// //   statsRow: {
// //     flexDirection: 'row',
// //     gap: theme.spacing.sm,
// //     marginBottom: theme.spacing.lg,
// //   },
// //   statCard: {
// //     flex: 1,
// //     backgroundColor: theme.colors.card,
// //     borderRadius: theme.radius.lg,
// //     padding: theme.spacing.md,
// //     borderWidth: 1,
// //     borderColor: theme.colors.border,
// //     alignItems: 'center',
// //     gap: 4,
// //   },
// //   statIcon: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: theme.radius.md,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginBottom: 4,
// //   },
// //   statValue: {
// //     fontSize: theme.fontSize.md,
// //     fontWeight: theme.fontWeight.bold,
// //     color: theme.colors.textPrimary,
// //   },
// //   statLabel: {
// //     fontSize: theme.fontSize.xs,
// //     color: theme.colors.earth[400],
// //     fontWeight: theme.fontWeight.medium,
// //   },
// //   alertCard: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#fef3c7',
// //     borderRadius: theme.radius.lg,
// //     padding: theme.spacing.md,
// //     marginBottom: theme.spacing.lg,
// //     borderWidth: 1,
// //     borderColor: '#fde68a',
// //   },
// //   alertIcon: {
// //     width: 44,
// //     height: 44,
// //     borderRadius: theme.radius.md,
// //     backgroundColor: '#fde68a',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   alertContent: { flex: 1, marginLeft: theme.spacing.md },
// //   alertTitle: { fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.bold, color: theme.colors.sun[600] },
// //   alertSubtitle: { fontSize: theme.fontSize.sm, color: theme.colors.sun[500], marginTop: 2 },
// //   actionsRow: {
// //     flexDirection: 'row',
// //     gap: theme.spacing.sm,
// //     marginBottom: theme.spacing.xl,
// //   },
// //   quickAction: {
// //     flex: 1,
// //     borderRadius: theme.radius.lg,
// //     padding: theme.spacing.md,
// //     alignItems: 'center',
// //     gap: 6,
// //   },
// //   quickActionIcon: { position: 'relative' },
// //   quickActionLabel: {
// //     fontSize: theme.fontSize.xs,
// //     fontWeight: theme.fontWeight.semibold,
// //     color: theme.colors.white,
// //   },
// //   quickBadge: {
// //     position: 'absolute',
// //     top: -6,
// //     right: -10,
// //     backgroundColor: theme.colors.red[500],
// //     borderRadius: 10,
// //     minWidth: 20,
// //     height: 20,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     paddingHorizontal: 4,
// //     borderWidth: 2,
// //     borderColor: theme.colors.white,
// //   },
// //   quickBadgeText: { color: theme.colors.white, fontSize: 10, fontWeight: theme.fontWeight.bold },
// //   section: { marginBottom: theme.spacing.xl },
// //   sectionHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: theme.spacing.sm,
// //   },
// //   sectionTitle: {
// //     fontSize: theme.fontSize.lg,
// //     fontWeight: theme.fontWeight.bold,
// //     color: theme.colors.textPrimary,
// //   },
// //   seeAll: {
// //     fontSize: theme.fontSize.sm,
// //     color: theme.colors.brand[600],
// //     fontWeight: theme.fontWeight.semibold,
// //   },
// //   cropCard: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     padding: theme.spacing.md,
// //     marginBottom: theme.spacing.sm,
// //   },
// //   cropIcon: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: theme.radius.md,
// //     backgroundColor: theme.colors.brand[50],
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   cropInfo: { flex: 1, marginLeft: theme.spacing.md },
// //   cropName: { fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.bold, color: theme.colors.textPrimary },
// //   cropMeta: { fontSize: theme.fontSize.sm, color: theme.colors.earth[400], marginTop: 2 },
// //   orderCard: { marginBottom: theme.spacing.sm },
// //   orderTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
// //   orderCrop: { fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.bold, color: theme.colors.textPrimary },
// //   orderBuyer: { fontSize: theme.fontSize.sm, color: theme.colors.earth[500], marginBottom: 8 },
// //   orderBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTopWidth: 1, borderTopColor: theme.colors.earth[100] },
// //   orderQty: { fontSize: theme.fontSize.sm, color: theme.colors.earth[500] },
// //   orderTotal: { fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.bold, color: theme.colors.brand[700] },
// //   deliveryCard: { marginBottom: theme.spacing.sm },
// //   deliveryRoute: { flexDirection: 'column', gap: 6, marginBottom: theme.spacing.sm },
// //   routePoint: { flexDirection: 'row', alignItems: 'center', gap: 6 },
// //   routeText: { fontSize: theme.fontSize.sm, color: theme.colors.textPrimary, fontWeight: theme.fontWeight.semibold },
// //   routeLine: { width: 1, height: 12, backgroundColor: theme.colors.earth[200], marginLeft: 6 },
// //   deliveryBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTopWidth: 1, borderTopColor: theme.colors.earth[100] },
// //   deliveryCrop: { fontSize: theme.fontSize.sm, color: theme.colors.earth[500] },
// //   notifRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: theme.spacing.sm, gap: 10 },
// //   notifDot: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
// //   notifContent: { flex: 1 },
// //   notifTitle: { fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.semibold, color: theme.colors.textPrimary },
// //   notifMessage: { fontSize: theme.fontSize.sm, color: theme.colors.earth[500], marginTop: 2 },
// //   notifTime: { fontSize: theme.fontSize.xs, color: theme.colors.earth[400], marginTop: 4 },
// //   pressed: { opacity: 0.7 },
// // });

// import React, {
//   useEffect,
//   useState,
//   useCallback,
// } from 'react';

// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   RefreshControl,
//   Pressable,
// } from 'react-native';

// import { useNavigation } from '@react-navigation/native';

// import type {
//   NativeStackNavigationProp,
// } from '@react-navigation/native-stack';

// import {
//   Sprout,
//   Wheat,
//   ShoppingBag,
//   Truck,
//   Bell,
//   ChevronRight,
//   MapPin,
//   Calendar,
//   Plus,
//   Pencil,
//   CircleCheck,
//   Clock,
//   Package,
//   TrendingUp,
//   Leaf,
// } from 'lucide-react-native';

// import { theme } from '@/theme';

// import {
//   api,
//   currentFarmer,
// } from '@/services/api';

// import type {
//   FarmerProduct,
//   Harvest,
//   Order,
//   Delivery,
//   AppNotification,
// } from '@/types';

// import {
//   formatNumber,
//   formatWeight,
//   formatCurrency,
//   formatDate,
//   timeAgo,
//   harvestStatusMeta,
//   orderStatusMeta,
//   deliveryStatusMeta,
// } from '@/services/format';

// import {
//   Card,
//   StatusBadge,
//   LoadingView,
// } from '@/components';

// import type {
//   RootStackParamList,
// } from '@/navigation/RootNavigator';

// type NavProp =
//   NativeStackNavigationProp<RootStackParamList>;

// export function HomeScreen() {
//   const navigation = useNavigation<NavProp>();

//   const [products, setProducts] =
//     useState<FarmerProduct[]>([]);

//   const [harvests, setHarvests] =
//     useState<Harvest[]>([]);

//   const [orders, setOrders] =
//     useState<Order[]>([]);

//   const [deliveries, setDeliveries] =
//     useState<Delivery[]>([]);

//   const [notifications, setNotifications] =
//     useState<AppNotification[]>([]);

//   const [loading, setLoading] =
//     useState(true);

//   const [refreshing, setRefreshing] =
//     useState(false);

//   const [updatingProductId, setUpdatingProductId] =
//     useState<string | null>(null);

//   // ────────────────────────────────────────────────────────────────
//   // Load farmer data
//   // ────────────────────────────────────────────────────────────────

//   const loadData = useCallback(async () => {
//     try {
//       const [
//         farmerProducts,
//         farmerHarvests,
//         farmerOrders,
//         farmerDeliveries,
//         farmerNotifications,
//       ] = await Promise.all([
//         api.getProducts(),
//         api.getHarvests(),
//         api.getOrders(),
//         api.getDeliveries(),
//         api.getNotifications(),
//       ]);

//       setProducts(farmerProducts);
//       setHarvests(farmerHarvests);
//       setOrders(farmerOrders);
//       setDeliveries(farmerDeliveries);
//       setNotifications(farmerNotifications);
//     } catch (error) {
//       console.error(
//         'Failed to load farmer dashboard:',
//         error
//       );
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, []);

//   useEffect(() => {
//     loadData();
//   }, [loadData]);

//   // ────────────────────────────────────────────────────────────────
//   // Farmer statistics
//   // ────────────────────────────────────────────────────────────────

//   const unreadCount =
//     notifications.filter(
//       (notification) => !notification.read
//     ).length;

//   const pendingOrders =
//     orders.filter(
//       (order) => order.status === 'pending'
//     );

//   const activeOrders =
//     orders.filter(
//       (order) =>
//         ![
//           'delivered',
//           'cancelled',
//           'denied',
//         ].includes(order.status)
//     ).length;

//   const activeDeliveries =
//     deliveries.filter(
//       (delivery) =>
//         delivery.status !== 'delivered'
//     ).length;

//   const readyProducts =
//     products.filter(
//       (product) =>
//         product.productionStage === 'ready' ||
//         product.productionStage === 'harvested'
//     );

//   const growingProducts =
//     products.filter(
//       (product) =>
//         product.productionStage !== 'ready' &&
//         product.productionStage !== 'harvested'
//     );

//   const totalExpectedYield =
//     products.reduce(
//       (sum, product) =>
//         sum + product.expectedYield,
//       0
//     );

//   const totalAvailableQuantity =
//     products.reduce(
//       (sum, product) =>
//         sum + product.availableQuantity,
//       0
//     );

//   const totalHarvestedYield =
//     harvests
//       .filter(
//         (harvest) =>
//           harvest.status === 'harvested'
//       )
//       .reduce(
//         (sum, harvest) =>
//           sum + harvest.actualYieldKg,
//         0
//       );

//   // ────────────────────────────────────────────────────────────────
//   // Update readiness directly from dashboard
//   // ────────────────────────────────────────────────────────────────

//   const changeReadiness = async (
//     product: FarmerProduct,
//     amount: number
//   ) => {
//     const nextValue = Math.max(
//       0,
//       Math.min(
//         100,
//         product.readinessPercentage + amount
//       )
//     );

//     try {
//       setUpdatingProductId(product.id);

//       const updated =
//         await api.updateProductReadiness(
//           product.id,
//           nextValue
//         );

//       setProducts((current) =>
//         current.map((item) =>
//           item.id === product.id
//             ? updated
//             : item
//         )
//       );
//     } catch (error) {
//       console.error(
//         'Failed to update readiness:',
//         error
//       );
//     } finally {
//       setUpdatingProductId(null);
//     }
//   };

//   // ────────────────────────────────────────────────────────────────
//   // Change production stage
//   // ────────────────────────────────────────────────────────────────

//   const advanceProductionStage = async (
//     product: FarmerProduct
//   ) => {
//     const stages: FarmerProduct['productionStage'][] =
//       [
//         'planted',
//         'growing',
//         'flowering',
//         'maturing',
//         'almost_ready',
//         'ready',
//         'harvested',
//       ];

//     const currentIndex =
//       stages.indexOf(
//         product.productionStage
//       );

//     const nextStage =
//       stages[
//         Math.min(
//           currentIndex + 1,
//           stages.length - 1
//         )
//       ];

//     if (!nextStage) return;

//     try {
//       setUpdatingProductId(product.id);

//       const updated =
//         await api.updateProductionStage(
//           product.id,
//           nextStage
//         );

//       setProducts((current) =>
//         current.map((item) =>
//           item.id === product.id
//             ? updated
//             : item
//         )
//       );
//     } catch (error) {
//       console.error(
//         'Failed to update production stage:',
//         error
//       );
//     } finally {
//       setUpdatingProductId(null);
//     }
//   };

//   // ────────────────────────────────────────────────────────────────
//   // Loading
//   // ────────────────────────────────────────────────────────────────

//   if (loading) {
//     return <LoadingView />;
//   }

//   // ────────────────────────────────────────────────────────────────
//   // Render
//   // ────────────────────────────────────────────────────────────────

//   return (
//     <ScrollView
//       style={styles.container}
//       contentContainerStyle={styles.content}
//       refreshControl={
//         <RefreshControl
//           refreshing={refreshing}
//           onRefresh={() => {
//             setRefreshing(true);
//             loadData();
//           }}
//           tintColor={theme.colors.brand[600]}
//         />
//       }
//     >
//       {/* ============================================================
//           HEADER
//       ============================================================ */}

//       <View style={styles.header}>
//         <View style={styles.headerLeft}>
//           <Text style={styles.greeting}>
//             Good morning
//           </Text>

//           <Text style={styles.farmerName}>
//             {currentFarmer.name}
//           </Text>

//           <View style={styles.locationRow}>
//             <MapPin
//               size={13}
//               color={theme.colors.earth[400]}
//             />

//             <Text style={styles.locationText}>
//               {currentFarmer.location}
//             </Text>
//           </View>
//         </View>

//         <Pressable
//           onPress={() =>
//             navigation.navigate('Profile')
//           }
//           style={styles.avatar}
//         >
//           <Text style={styles.avatarText}>
//             {currentFarmer.name
//               .split(' ')
//               .map((name) => name[0])
//               .slice(0, 2)
//               .join('')}
//           </Text>
//         </Pressable>
//       </View>

//       {/* ============================================================
//           FARM OVERVIEW
//       ============================================================ */}

//       <Card style={styles.farmOverview}>
//         <View style={styles.farmOverviewTop}>
//           <View style={styles.farmIcon}>
//             <Sprout
//               size={22}
//               color={theme.colors.brand[600]}
//             />
//           </View>

//           <View style={styles.farmOverviewInfo}>
//             <Text style={styles.farmOverviewTitle}>
//               My Farm
//             </Text>

//             <Text style={styles.farmOverviewSubtitle}>
//               {currentFarmer.farmSizeHectares} hectares
//               {' · '}
//               {products.length} product
//               {products.length !== 1 ? 's' : ''}
//             </Text>
//           </View>

//           <Pressable
//             onPress={() =>
//               navigation.navigate('Profile')
//             }
//             style={styles.editButton}
//           >
//             <Pencil
//               size={16}
//               color={theme.colors.brand[600]}
//             />
//           </Pressable>
//         </View>

//         {currentFarmer.farmDescription && (
//           <Text
//             style={styles.farmDescription}
//             numberOfLines={2}
//           >
//             {currentFarmer.farmDescription}
//           </Text>
//         )}
//       </Card>

//       {/* ============================================================
//           FARMER ACTIONS
//       ============================================================ */}

//       <View style={styles.actionsHeader}>
//         <Text style={styles.sectionTitle}>
//           Farm Management
//         </Text>
//       </View>

//       <View style={styles.actionsGrid}>
//         <ManagementAction
//           icon={
//             <Plus
//               size={22}
//               color={theme.colors.white}
//             />
//           }
//           label="Add Product"
//           description="Add a new crop"
//           background={theme.colors.brand[600]}
//           onPress={() =>
//             navigation.navigate('Farm')
//           }
//         />

//         <ManagementAction
//           icon={
//             <Leaf
//               size={22}
//               color={theme.colors.white}
//             />
//           }
//           label="My Products"
//           description="Manage production"
//           background={theme.colors.sky[600]}
//           onPress={() =>
//             navigation.navigate('Farm')
//           }
//         />

//         <ManagementAction
//           icon={
//             <Wheat
//               size={22}
//               color={theme.colors.white}
//             />
//           }
//           label="Record Harvest"
//           description="Record harvested crops"
//           background={theme.colors.sun[600]}
//           onPress={() =>
//             navigation.navigate(
//               'RecordHarvest'
//             )
//           }
//         />

//         <ManagementAction
//           icon={
//             <Pencil
//               size={22}
//               color={theme.colors.white}
//             />
//           }
//           label="Farm Profile"
//           description="Update farm details"
//           background={theme.colors.indigo[500]}
//           onPress={() =>
//             navigation.navigate('Profile')
//           }
//         />
//       </View>

//       {/* ============================================================
//           PRODUCTION SUMMARY
//       ============================================================ */}

//       <View style={styles.section}>
//         <View style={styles.sectionHeader}>
//           <View>
//             <Text style={styles.sectionTitle}>
//               Production Overview
//             </Text>

//             <Text style={styles.sectionSubtitle}>
//               Keep your crop information up to date
//             </Text>
//           </View>

//           <TrendingUp
//             size={20}
//             color={theme.colors.brand[600]}
//           />
//         </View>

//         <View style={styles.statsRow}>
//           <StatCard
//             icon={
//               <Sprout
//                 size={19}
//                 color={theme.colors.brand[600]}
//               />
//             }
//             label="Growing"
//             value={`${growingProducts.length}`}
//             bg={theme.colors.brand[50]}
//           />

//           <StatCard
//             icon={
//               <CircleCheck
//                 size={19}
//                 color={theme.colors.sky[600]}
//               />
//             }
//             label="Ready"
//             value={`${readyProducts.length}`}
//             bg="#e0f2fe"
//           />

//           <StatCard
//             icon={
//               <Wheat
//                 size={19}
//                 color={theme.colors.sun[600]}
//               />
//             }
//             label="Harvested"
//             value={formatWeight(
//               totalHarvestedYield
//             )}
//             bg="#fef3c7"
//           />
//         </View>
//       </View>

//       {/* ============================================================
//           READY FOR HARVEST
//       ============================================================ */}

//       {readyProducts.length > 0 && (
//         <Pressable
//           onPress={() =>
//             navigation.navigate(
//               'RecordHarvest'
//             )
//           }
//           style={({ pressed }) => [
//             styles.alertCard,
//             pressed && styles.pressed,
//           ]}
//         >
//           <View style={styles.alertIcon}>
//             <Wheat
//               size={22}
//               color={theme.colors.sun[600]}
//             />
//           </View>

//           <View style={styles.alertContent}>
//             <Text style={styles.alertTitle}>
//               {readyProducts.length} crop
//               {readyProducts.length > 1
//                 ? 's'
//                 : ''}{' '}
//               ready for harvest
//             </Text>

//             <Text style={styles.alertSubtitle}>
//               Record the actual harvest quantity
//             </Text>
//           </View>

//           <ChevronRight
//             size={20}
//             color={theme.colors.earth[400]}
//           />
//         </Pressable>
//       )}

//       {/* ============================================================
//           MY CROPS
//       ============================================================ */}

//       <View style={styles.section}>
//         <View style={styles.sectionHeader}>
//           <View>
//             <Text style={styles.sectionTitle}>
//               My Crops
//             </Text>

//             <Text style={styles.sectionSubtitle}>
//               Update readiness as your crops develop
//             </Text>
//           </View>

//           <Pressable
//             onPress={() =>
//               navigation.navigate('Farm')
//             }
//           >
//             <Text style={styles.seeAll}>
//               Manage
//             </Text>
//           </Pressable>
//         </View>

//         {products.length === 0 ? (
//           <Card style={styles.emptyCard}>
//             <Sprout
//               size={30}
//               color={theme.colors.earth[300]}
//             />

//             <Text style={styles.emptyTitle}>
//               No crops added yet
//             </Text>

//             <Text style={styles.emptyText}>
//               Add your first crop so customers
//               can eventually see what you produce.
//             </Text>

//             <Pressable
//               onPress={() =>
//                 navigation.navigate('Farm')
//               }
//               style={styles.emptyButton}
//             >
//               <Plus
//                 size={16}
//                 color={theme.colors.white}
//               />

//               <Text style={styles.emptyButtonText}>
//                 Add Crop
//               </Text>
//             </Pressable>
//           </Card>
//         ) : (
//           products
//             .slice(0, 4)
//             .map((product) => {
//               const statusMeta =
//                 harvestStatusMeta[
//                   product.productionStage
//                 ];

//               const isUpdating =
//                 updatingProductId ===
//                 product.id;

//               return (
//                 <Card
//                   key={product.id}
//                   style={styles.productCard}
//                 >
//                   {/* Product header */}
//                   <View
//                     style={
//                       styles.productHeader
//                     }
//                   >
//                     <View
//                       style={styles.productIcon}
//                     >
//                       <Wheat
//                         size={18}
//                         color={
//                           theme.colors.brand[600]
//                         }
//                       />
//                     </View>

//                     <View
//                       style={
//                         styles.productInfo
//                       }
//                     >
//                       <Text
//                         style={
//                           styles.productName
//                         }
//                       >
//                         {product.cropName}
//                       </Text>

//                       <Text
//                         style={
//                           styles.productVariety
//                         }
//                       >
//                         {product.variety ||
//                           product.category}
//                       </Text>
//                     </View>

//                     <StatusBadge
//                       label={
//                         statusMeta.label
//                       }
//                       bg={statusMeta.bg}
//                       text={statusMeta.text}
//                       dot={statusMeta.dot}
//                     />
//                   </View>

//                   {/* Readiness */}
//                   <View
//                     style={
//                       styles.readinessSection
//                     }
//                   >
//                     <View
//                       style={
//                         styles.readinessHeader
//                       }
//                     >
//                       <Text
//                         style={
//                           styles.readinessLabel
//                         }
//                       >
//                         Production readiness
//                       </Text>

//                       <Text
//                         style={
//                           styles.readinessValue
//                         }
//                       >
//                         {
//                           product.readinessPercentage
//                         }%
//                       </Text>
//                     </View>

//                     <View
//                       style={
//                         styles.progressBackground
//                       }
//                     >
//                       <View
//                         style={[
//                           styles.progressFill,
//                           {
//                             width: `${product.readinessPercentage}%`,
//                           },
//                         ]}
//                       />
//                     </View>

//                     <View
//                       style={
//                         styles.readinessControls
//                       }
//                     >
//                       <Pressable
//                         disabled={isUpdating}
//                         onPress={() =>
//                           changeReadiness(
//                             product,
//                             -5
//                           )
//                         }
//                         style={
//                           styles.smallButton
//                         }
//                       >
//                         <Text
//                           style={
//                             styles.smallButtonText
//                           }
//                         >
//                           −5%
//                         </Text>
//                       </Pressable>

//                       <Text
//                         style={
//                           styles.readinessHint
//                         }
//                       >
//                         Update when crop
//                         condition changes
//                       </Text>

//                       <Pressable
//                         disabled={isUpdating}
//                         onPress={() =>
//                           changeReadiness(
//                             product,
//                             5
//                           )
//                         }
//                         style={
//                           styles.smallButton
//                         }
//                       >
//                         <Text
//                           style={
//                             styles.smallButtonText
//                           }
//                         >
//                           +5%
//                         </Text>
//                       </Pressable>
//                     </View>
//                   </View>

//                   {/* Product information */}
//                   <View
//                     style={
//                       styles.productDetails
//                     }
//                   >
//                     <ProductDetail
//                       icon={
//                         <Package
//                           size={14}
//                           color={
//                             theme.colors.earth[400]
//                           }
//                         />
//                       }
//                       label="Expected"
//                       value={`${formatNumber(
//                         product.expectedYield
//                       )} ${product.unit}`}
//                     />

//                     <ProductDetail
//                       icon={
//                         <Calendar
//                           size={14}
//                           color={
//                             theme.colors.earth[400]
//                           }
//                         />
//                       }
//                       label="Harvest"
//                       value={formatDate(
//                         product.expectedHarvestDate
//                       )}
//                     />

//                     <ProductDetail
//                       icon={
//                         <TrendingUp
//                           size={14}
//                           color={
//                             theme.colors.earth[400]
//                           }
//                         />
//                       }
//                       label="Price"
//                       value={formatCurrency(
//                         product.unitPrice
//                       )}
//                     />
//                   </View>

//                   {/* Available quantity */}
//                   {product.availableQuantity >
//                     0 && (
//                     <View
//                       style={
//                         styles.availableRow
//                       }
//                     >
//                       <Text
//                         style={
//                           styles.availableLabel
//                         }
//                       >
//                         Available for orders
//                       </Text>

//                       <Text
//                         style={
//                           styles.availableValue
//                         }
//                       >
//                         {formatNumber(
//                           product.availableQuantity
//                         )}{' '}
//                         {product.unit}
//                       </Text>
//                     </View>
//                   )}

//                   {/* Stage update */}
//                   {product.productionStage !==
//                     'harvested' && (
//                     <Pressable
//                       disabled={isUpdating}
//                       onPress={() =>
//                         advanceProductionStage(
//                           product
//                         )
//                       }
//                       style={({ pressed }) => [
//                         styles.stageButton,
//                         pressed &&
//                           styles.pressed,
//                         isUpdating &&
//                           styles.disabledButton,
//                       ]}
//                     >
//                       <CircleCheck
//                         size={16}
//                         color={
//                           theme.colors.brand[600]
//                         }
//                       />

//                       <Text
//                         style={
//                           styles.stageButtonText
//                         }
//                       >
//                         Move to next production
//                         stage
//                       </Text>

//                       <ChevronRight
//                         size={16}
//                         color={
//                           theme.colors.brand[600]
//                         }
//                       />
//                     </Pressable>
//                   )}

//                   {/* Full edit */}
//                   <Pressable
//                     onPress={() =>
//                       navigation.navigate('Farm')
//                     }
//                     style={
//                       styles.editProductButton
//                     }
//                   >
//                     <Pencil
//                       size={15}
//                       color={
//                         theme.colors.brand[600]
//                       }
//                     />

//                     <Text
//                       style={
//                         styles.editProductText
//                       }
//                     >
//                       Edit full product details
//                     </Text>
//                   </Pressable>
//                 </Card>
//               );
//             })
//         )}
//       </View>

//       {/* ============================================================
//           CUSTOMER ORDERS
//       ============================================================ */}

//       <View style={styles.section}>
//         <View style={styles.sectionHeader}>
//           <View>
//             <Text style={styles.sectionTitle}>
//               Customer Orders
//             </Text>

//             <Text style={styles.sectionSubtitle}>
//               Orders from customers require your
//               decision
//             </Text>
//           </View>

//           <Pressable
//             onPress={() =>
//               navigation.navigate('Orders')
//             }
//           >
//             <Text style={styles.seeAll}>
//               See all
//             </Text>
//           </Pressable>
//         </View>

//         {/* Pending order alert */}
//         {pendingOrders.length > 0 && (
//           <Pressable
//             onPress={() =>
//               navigation.navigate('Orders')
//             }
//             style={({ pressed }) => [
//               styles.orderAlert,
//               pressed && styles.pressed,
//             ]}
//           >
//             <View
//               style={styles.orderAlertIcon}
//             >
//               <ShoppingBag
//                 size={20}
//                 color={theme.colors.brand[600]}
//               />
//             </View>

//             <View
//               style={styles.orderAlertContent}
//             >
//               <Text
//                 style={
//                   styles.orderAlertTitle
//                 }
//               >
//                 {pendingOrders.length} order
//                 {pendingOrders.length > 1
//                   ? 's'
//                   : ''}{' '}
//                 waiting for your decision
//               </Text>

//               <Text
//                 style={
//                   styles.orderAlertText
//                 }
//               >
//                 Review and approve or deny each
//                 customer request.
//               </Text>
//             </View>

//             <ChevronRight
//               size={20}
//               color={
//                 theme.colors.earth[400]
//               }
//             />
//           </Pressable>
//         )}

//         {orders.length === 0 ? (
//           <Card style={styles.emptyCard}>
//             <ShoppingBag
//               size={28}
//               color={theme.colors.earth[300]}
//             />

//             <Text style={styles.emptyTitle}>
//               No customer orders
//             </Text>

//             <Text style={styles.emptyText}>
//               Customer orders will appear here
//               when someone wants to buy your
//               products.
//             </Text>
//           </Card>
//         ) : (
//           orders
//             .slice(0, 2)
//             .map((order) => {
//               const meta =
//                 orderStatusMeta[
//                   order.status
//                 ];

//               return (
//                 <Pressable
//                   key={order.id}
//                   onPress={() =>
//                     navigation.navigate(
//                       'OrderDetail',
//                       {
//                         orderId: order.id,
//                       }
//                     )
//                   }
//                   style={({ pressed }) =>
//                     pressed
//                       ? styles.pressed
//                       : undefined
//                   }
//                 >
//                   <Card
//                     style={
//                       styles.orderCard
//                     }
//                   >
//                     <View
//                       style={
//                         styles.orderTop
//                       }
//                     >
//                       <View>
//                         <Text
//                           style={
//                             styles.orderCrop
//                           }
//                         >
//                           {order.cropName}
//                         </Text>

//                         <Text
//                           style={
//                             styles.orderBuyer
//                           }
//                         >
//                           {order.buyerCompany}
//                         </Text>
//                       </View>

//                       <StatusBadge
//                         label={meta.label}
//                         bg={meta.bg}
//                         text={meta.text}
//                         dot={meta.dot}
//                       />
//                     </View>

//                     <View
//                       style={
//                         styles.orderBottom
//                       }
//                     >
//                       <Text
//                         style={
//                           styles.orderQty
//                         }
//                       >
//                         {formatNumber(
//                           order.quantityKg
//                         )}{' '}
//                         kg
//                       </Text>

//                       <Text
//                         style={
//                           styles.orderTotal
//                         }
//                       >
//                         {formatCurrency(
//                           order.totalValue
//                         )}
//                       </Text>
//                     </View>
//                   </Card>
//                 </Pressable>
//               );
//             })
//         )}
//       </View>

//       {/* ============================================================
//           FARM PRODUCTION NUMBERS
//       ============================================================ */}

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>
//           Farm Production
//         </Text>

//         <View style={styles.productionCard}>
//           <ProductionNumber
//             label="Expected yield"
//             value={formatWeight(
//               totalExpectedYield
//             )}
//           />

//           <View
//             style={
//               styles.productionDivider
//             }
//           />

//           <ProductionNumber
//             label="Available"
//             value={formatWeight(
//               totalAvailableQuantity
//             )}
//           />

//           <View
//             style={
//               styles.productionDivider
//             }
//           />

//           <ProductionNumber
//             label="Products"
//             value={`${products.length}`}
//           />
//         </View>
//       </View>

//       {/* ============================================================
//           DELIVERIES
//       ============================================================ */}

//       {deliveries.length > 0 && (
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <View>
//               <Text style={styles.sectionTitle}>
//                 Deliveries
//               </Text>

//               <Text
//                 style={
//                   styles.sectionSubtitle
//                 }
//               >
//                 Track orders you have approved
//               </Text>
//             </View>

//             <Pressable
//               onPress={() =>
//                 navigation.navigate(
//                   'Deliveries'
//                 )
//               }
//             >
//               <Text style={styles.seeAll}>
//                 See all
//               </Text>
//             </Pressable>
//           </View>

//           {deliveries
//             .slice(0, 2)
//             .map((delivery) => {
//               const meta =
//                 deliveryStatusMeta[
//                   delivery.status
//                 ];

//               return (
//                 <Pressable
//                   key={delivery.id}
//                   onPress={() =>
//                     navigation.navigate(
//                       'DeliveryDetail',
//                       {
//                         deliveryId:
//                           delivery.id,
//                       }
//                     )
//                   }
//                   style={({ pressed }) =>
//                     pressed
//                       ? styles.pressed
//                       : undefined
//                   }
//                 >
//                   <Card
//                     style={
//                       styles.deliveryCard
//                     }
//                   >
//                     <View
//                       style={
//                         styles.deliveryTop
//                       }
//                     >
//                       <Truck
//                         size={18}
//                         color={
//                           theme.colors.sky[600]
//                         }
//                       />

//                       <Text
//                         style={
//                           styles.deliveryCrop
//                         }
//                       >
//                         {delivery.cropName}
//                       </Text>

//                       <StatusBadge
//                         label={meta.label}
//                         bg={meta.bg}
//                         text={meta.text}
//                         dot={meta.dot}
//                       />
//                     </View>

//                     <View
//                       style={
//                         styles.deliveryRoute
//                       }
//                     >
//                       <Text
//                         style={
//                           styles.routeText
//                         }
//                         numberOfLines={1}
//                       >
//                         {delivery.pickupLocation}
//                       </Text>

//                       <ChevronRight
//                         size={14}
//                         color={
//                           theme.colors.earth[300]
//                         }
//                       />

//                       <Text
//                         style={
//                           styles.routeText
//                         }
//                         numberOfLines={1}
//                       >
//                         {delivery.deliveryLocation}
//                       </Text>
//                     </View>
//                   </Card>
//                 </Pressable>
//               );
//             })}
//         </View>
//       )}

//       {/* ============================================================
//           RECENT ACTIVITY
//       ============================================================ */}

//       {notifications.length > 0 && (
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <View>
//               <Text style={styles.sectionTitle}>
//                 Recent Activity
//               </Text>

//               <Text
//                 style={
//                   styles.sectionSubtitle
//                 }
//               >
//                 Updates about your farm
//               </Text>
//             </View>

//             {unreadCount > 0 && (
//               <View
//                 style={
//                   styles.notificationCount
//                 }
//               >
//                 <Bell
//                   size={14}
//                   color={
//                     theme.colors.brand[600]
//                   }
//                 />

//                 <Text
//                   style={
//                     styles.notificationCountText
//                   }
//                 >
//                   {unreadCount} new
//                 </Text>
//               </View>
//             )}
//           </View>

//           {notifications
//             .slice(0, 3)
//             .map((notification) => (
//               <View
//                 key={notification.id}
//                 style={styles.notifRow}
//               >
//                 <View
//                   style={[
//                     styles.notifDot,
//                     {
//                       backgroundColor:
//                         notification.read
//                           ? theme.colors
//                               .earth[200]
//                           : theme.colors
//                               .brand[500],
//                     },
//                   ]}
//                 />

//                 <View
//                   style={
//                     styles.notifContent
//                   }
//                 >
//                   <Text
//                     style={
//                       styles.notifTitle
//                     }
//                   >
//                     {notification.title}
//                   </Text>

//                   <Text
//                     style={
//                       styles.notifMessage
//                     }
//                     numberOfLines={2}
//                   >
//                     {notification.message}
//                   </Text>

//                   <Text
//                     style={
//                       styles.notifTime
//                     }
//                   >
//                     {timeAgo(
//                       notification.timestamp
//                     )}
//                   </Text>
//                 </View>
//               </View>
//             ))}
//         </View>
//       )}

//       <View style={{ height: 32 }} />
//     </ScrollView>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────
// // Management Action
// // ─────────────────────────────────────────────────────────────────────

// function ManagementAction({
//   icon,
//   label,
//   description,
//   background,
//   onPress,
// }: {
//   icon: React.ReactNode;
//   label: string;
//   description: string;
//   background: string;
//   onPress: () => void;
// }) {
//   return (
//     <Pressable
//       onPress={onPress}
//       style={({ pressed }) => [
//         styles.managementAction,
//         {
//           backgroundColor: background,
//         },
//         pressed && styles.pressed,
//       ]}
//     >
//       <View
//         style={
//           styles.managementActionIcon
//         }
//       >
//         {icon}
//       </View>

//       <Text
//         style={
//           styles.managementActionLabel
//         }
//       >
//         {label}
//       </Text>

//       <Text
//         style={
//           styles.managementActionDescription
//         }
//       >
//         {description}
//       </Text>
//     </Pressable>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────
// // Stat Card
// // ─────────────────────────────────────────────────────────────────────

// function StatCard({
//   icon,
//   label,
//   value,
//   bg,
// }: {
//   icon: React.ReactNode;
//   label: string;
//   value: string;
//   bg: string;
// }) {
//   return (
//     <View style={styles.statCard}>
//       <View
//         style={[
//           styles.statIcon,
//           {
//             backgroundColor: bg,
//           },
//         ]}
//       >
//         {icon}
//       </View>

//       <Text style={styles.statValue}>
//         {value}
//       </Text>

//       <Text style={styles.statLabel}>
//         {label}
//       </Text>
//     </View>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────
// // Product Detail
// // ─────────────────────────────────────────────────────────────────────

// function ProductDetail({
//   icon,
//   label,
//   value,
// }: {
//   icon: React.ReactNode;
//   label: string;
//   value: string;
// }) {
//   return (
//     <View style={styles.productDetail}>
//       {icon}

//       <View style={styles.productDetailText}>
//         <Text
//           style={
//             styles.productDetailLabel
//           }
//         >
//           {label}
//         </Text>

//         <Text
//           style={
//             styles.productDetailValue
//           }
//         >
//           {value}
//         </Text>
//       </View>
//     </View>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────
// // Production Number
// // ─────────────────────────────────────────────────────────────────────

// function ProductionNumber({
//   label,
//   value,
// }: {
//   label: string;
//   value: string;
// }) {
//   return (
//     <View style={styles.productionNumber}>
//       <Text
//         style={
//           styles.productionNumberValue
//         }
//       >
//         {value}
//       </Text>

//       <Text
//         style={
//           styles.productionNumberLabel
//         }
//       >
//         {label}
//       </Text>
//     </View>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────
// // Styles
// // ─────────────────────────────────────────────────────────────────────

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor:
//       theme.colors.background,
//   },

//   content: {
//     paddingHorizontal:
//       theme.spacing.lg,
//     paddingTop:
//       theme.spacing.xl,
//   },

//   // Header
//   header: {
//     flexDirection: 'row',
//     justifyContent:
//       'space-between',
//     alignItems: 'center',
//     marginBottom:
//       theme.spacing.lg,
//   },

//   headerLeft: {
//     flex: 1,
//   },

//   greeting: {
//     fontSize:
//       theme.fontSize.sm,
//     color:
//       theme.colors.earth[400],
//     fontWeight:
//       theme.fontWeight.medium,
//   },

//   farmerName: {
//     fontSize:
//       theme.fontSize.xxl,
//     fontWeight:
//       theme.fontWeight.extrabold,
//     color:
//       theme.colors.textPrimary,
//     marginTop: 2,
//   },

//   locationRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     marginTop: 4,
//   },

//   locationText: {
//     fontSize:
//       theme.fontSize.sm,
//     color:
//       theme.colors.earth[400],
//   },

//   avatar: {
//     width: 46,
//     height: 46,
//     borderRadius: 23,
//     backgroundColor:
//       theme.colors.brand[600],
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   avatarText: {
//     color: theme.colors.white,
//     fontWeight:
//       theme.fontWeight.bold,
//     fontSize:
//       theme.fontSize.sm,
//   },

//   // Farm overview
//   farmOverview: {
//     padding: theme.spacing.md,
//     marginBottom:
//       theme.spacing.lg,
//   },

//   farmOverviewTop: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },

//   farmIcon: {
//     width: 44,
//     height: 44,
//     borderRadius:
//       theme.radius.md,
//     backgroundColor:
//       theme.colors.brand[50],
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   farmOverviewInfo: {
//     flex: 1,
//     marginLeft:
//       theme.spacing.md,
//   },

//   farmOverviewTitle: {
//     fontSize:
//       theme.fontSize.md,
//     fontWeight:
//       theme.fontWeight.bold,
//     color:
//       theme.colors.textPrimary,
//   },

//   farmOverviewSubtitle: {
//     fontSize:
//       theme.fontSize.sm,
//     color:
//       theme.colors.earth[400],
//     marginTop: 2,
//   },

//   farmDescription: {
//     fontSize:
//       theme.fontSize.sm,
//     color:
//       theme.colors.earth[500],
//     lineHeight: 19,
//     marginTop:
//       theme.spacing.md,
//   },

//   editButton: {
//     width: 34,
//     height: 34,
//     borderRadius: 17,
//     backgroundColor:
//       theme.colors.brand[50],
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   // Sections
//   section: {
//     marginBottom:
//       theme.spacing.xl,
//   },

//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent:
//       'space-between',
//     alignItems: 'center',
//     marginBottom:
//       theme.spacing.sm,
//   },

//   sectionTitle: {
//     fontSize:
//       theme.fontSize.lg,
//     fontWeight:
//       theme.fontWeight.bold,
//     color:
//       theme.colors.textPrimary,
//   },

//   sectionSubtitle: {
//     fontSize:
//       theme.fontSize.xs,
//     color:
//       theme.colors.earth[400],
//     marginTop: 3,
//   },

//   seeAll: {
//     fontSize:
//       theme.fontSize.sm,
//     color:
//       theme.colors.brand[600],
//     fontWeight:
//       theme.fontWeight.semibold,
//   },

//   actionsHeader: {
//     marginBottom:
//       theme.spacing.sm,
//   },

//   // Management actions
//   actionsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: theme.spacing.sm,
//     marginBottom:
//       theme.spacing.xl,
//   },

//   managementAction: {
//     width: '48%',
//     minHeight: 116,
//     borderRadius:
//       theme.radius.lg,
//     padding:
//       theme.spacing.md,
//     justifyContent: 'space-between',
//   },

//   managementActionIcon: {
//     width: 38,
//     height: 38,
//     borderRadius:
//       theme.radius.md,
//     backgroundColor:
//       'rgba(255,255,255,0.18)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   managementActionLabel: {
//     color: theme.colors.white,
//     fontSize:
//       theme.fontSize.sm,
//     fontWeight:
//       theme.fontWeight.bold,
//     marginTop: 8,
//   },

//   managementActionDescription: {
//     color:
//       'rgba(255,255,255,0.78)',
//     fontSize:
//       theme.fontSize.xs,
//     marginTop: 2,
//   },

//   // Stats
//   statsRow: {
//     flexDirection: 'row',
//     gap: theme.spacing.sm,
//   },

//   statCard: {
//     flex: 1,
//     backgroundColor:
//       theme.colors.card,
//     borderRadius:
//       theme.radius.lg,
//     padding:
//       theme.spacing.md,
//     borderWidth: 1,
//     borderColor:
//       theme.colors.border,
//     alignItems: 'center',
//     gap: 4,
//   },

//   statIcon: {
//     width: 38,
//     height: 38,
//     borderRadius:
//       theme.radius.md,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 3,
//   },

//   statValue: {
//     fontSize:
//       theme.fontSize.md,
//     fontWeight:
//       theme.fontWeight.bold,
//     color:
//       theme.colors.textPrimary,
//   },

//   statLabel: {
//     fontSize:
//       theme.fontSize.xs,
//     color:
//       theme.colors.earth[400],
//     fontWeight:
//       theme.fontWeight.medium,
//     textAlign: 'center',
//   },

//   // Ready alert
//   alertCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fef3c7',
//     borderRadius:
//       theme.radius.lg,
//     padding:
//       theme.spacing.md,
//     marginBottom:
//       theme.spacing.xl,
//     borderWidth: 1,
//     borderColor: '#fde68a',
//   },

//   alertIcon: {
//     width: 44,
//     height: 44,
//     borderRadius:
//       theme.radius.md,
//     backgroundColor: '#fde68a',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   alertContent: {
//     flex: 1,
//     marginLeft:
//       theme.spacing.md,
//   },

//   alertTitle: {
//     fontSize:
//       theme.fontSize.md,
//     fontWeight:
//       theme.fontWeight.bold,
//     color:
//       theme.colors.sun[600],
//   },

//   alertSubtitle: {
//     fontSize:
//       theme.fontSize.sm,
//     color:
//       theme.colors.sun[500],
//     marginTop: 2,
//   },

//   // Product card
//   productCard: {
//     marginBottom:
//       theme.spacing.sm,
//     padding:
//       theme.spacing.md,
//   },

//   productHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },

//   productIcon: {
//     width: 40,
//     height: 40,
//     borderRadius:
//       theme.radius.md,
//     backgroundColor:
//       theme.colors.brand[50],
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   productInfo: {
//     flex: 1,
//     marginLeft:
//       theme.spacing.md,
//   },

//   productName: {
//     fontSize:
//       theme.fontSize.md,
//     fontWeight:
//       theme.fontWeight.bold,
//     color:
//       theme.colors.textPrimary,
//   },

//   productVariety: {
//     fontSize:
//       theme.fontSize.xs,
//     color:
//       theme.colors.earth[400],
//     marginTop: 2,
//   },

//   // Readiness
//   readinessSection: {
//     marginTop:
//       theme.spacing.md,
//   },

//   readinessHeader: {
//     flexDirection: 'row',
//     justifyContent:
//       'space-between',
//     alignItems: 'center',
//     marginBottom: 6,
//   },

//   readinessLabel: {
//     fontSize:
//       theme.fontSize.sm,
//     color:
//       theme.colors.earth[500],
//     fontWeight:
//       theme.fontWeight.medium,
//   },

//   readinessValue: {
//     fontSize:
//       theme.fontSize.sm,
//     color:
//       theme.colors.brand[700],
//     fontWeight:
//       theme.fontWeight.bold,
//   },

//   progressBackground: {
//     height: 8,
//     borderRadius: 4,
//     backgroundColor:
//       theme.colors.earth[100],
//     overflow: 'hidden',
//   },

//   progressFill: {
//     height: '100%',
//     borderRadius: 4,
//     backgroundColor:
//       theme.colors.brand[500],
//   },

//   readinessControls: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent:
//       'space-between',
//     marginTop: 8,
//   },

//   readinessHint: {
//     flex: 1,
//     textAlign: 'center',
//     fontSize:
//       theme.fontSize.xs,
//     color:
//       theme.colors.earth[400],
//     paddingHorizontal: 6,
//   },

//   smallButton: {
//     minWidth: 44,
//     height: 32,
//     borderRadius:
//       theme.radius.sm,
//     backgroundColor:
//       theme.colors.brand[50],
//     borderWidth: 1,
//     borderColor:
//       theme.colors.brand[100],
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 8,
//   },

//   smallButtonText: {
//     fontSize:
//       theme.fontSize.xs,
//     fontWeight:
//       theme.fontWeight.bold,
//     color:
//       theme.colors.brand[700],
//   },

//   // Product details
//   productDetails: {
//     flexDirection: 'row',
//     justifyContent:
//       'space-between',
//     marginTop:
//       theme.spacing.md,
//     paddingTop:
//       theme.spacing.md,
//     borderTopWidth: 1,
//     borderTopColor:
//       theme.colors.earth[100],
//   },

//   productDetail: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },

//   productDetailText: {
//     marginLeft: 5,
//   },

//   productDetailLabel: {
//     fontSize:
//       theme.fontSize.xs,
//     color:
//       theme.colors.earth[400],
//   },

//   productDetailValue: {
//     fontSize:
//       theme.fontSize.xs,
//     color:
//       theme.colors.textPrimary,
//     fontWeight:
//       theme.fontWeight.semibold,
//     marginTop: 1,
//   },

//   availableRow: {
//     flexDirection: 'row',
//     justifyContent:
//       'space-between',
//     alignItems: 'center',
//     backgroundColor:
//       theme.colors.brand[50],
//     borderRadius:
//       theme.radius.sm,
//     padding:
//       theme.spacing.sm,
//     marginTop:
//       theme.spacing.sm,
//   },

//   availableLabel: {
//     fontSize:
//       theme.fontSize.xs,
//     color:
//       theme.colors.earth[500],
//   },

//   availableValue: {
//     fontSize:
//       theme.fontSize.sm,
//     color:
//       theme.colors.brand[700],
//     fontWeight:
//       theme.fontWeight.bold,
//   },

//   stageButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 6,
//     borderWidth: 1,
//     borderColor:
//       theme.colors.brand[100],
//     backgroundColor:
//       theme.colors.brand[50],
//     borderRadius:
//       theme.radius.md,
//     paddingVertical: 10,
//     marginTop:
//       theme.spacing.sm,
//   },

//   stageButtonText: {
//     fontSize:
//       theme.fontSize.xs,
//     color:
//       theme.colors.brand[700],
//     fontWeight:
//       theme.fontWeight.semibold,
//   },

//   editProductButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 6,
//     paddingTop: 10,
//   },

//   editProductText: {
//     fontSize:
//       theme.fontSize.xs,
//     color:
//       theme.colors.brand[600],
//     fontWeight:
//       theme.fontWeight.semibold,
//   },

//   disabledButton: {
//     opacity: 0.5,
//   },

//   // Orders
//   orderAlert: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor:
//       theme.colors.brand[50],
//     borderWidth: 1,
//     borderColor:
//       theme.colors.brand[100],
//     borderRadius:
//       theme.radius.lg,
//     padding:
//       theme.spacing.md,
//     marginBottom:
//       theme.spacing.sm,
//   },

//   orderAlertIcon: {
//     width: 42,
//     height: 42,
//     borderRadius:
//       theme.radius.md,
//     backgroundColor:
//       theme.colors.white,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   orderAlertContent: {
//     flex: 1,
//     marginLeft:
//       theme.spacing.md,
//   },

//   orderAlertTitle: {
//     fontSize:
//       theme.fontSize.sm,
//     fontWeight:
//       theme.fontWeight.bold,
//     color:
//       theme.colors.brand[700],
//   },

//   orderAlertText: {
//     fontSize:
//       theme.fontSize.xs,
//     color:
//       theme.colors.earth[500],
//     marginTop: 3,
//     lineHeight: 17,
//   },

//   orderCard: {
//     marginBottom:
//       theme.spacing.sm,
//     padding:
//       theme.spacing.md,
//   },

//   orderTop: {
//     flexDirection: 'row',
//     justifyContent:
//       'space-between',
//     alignItems: 'center',
//   },

//   orderCrop: {
//     fontSize:
//       theme.fontSize.md,
//     fontWeight:
//       theme.fontWeight.bold,
//     color:
//       theme.colors.textPrimary,
//   },

//   orderBuyer: {
//     fontSize:
//       theme.fontSize.xs,
//     color:
//       theme.colors.earth[400],
//     marginTop: 2,
//   },

//   orderBottom: {
//     flexDirection: 'row',
//     justifyContent:
//       'space-between',
//     alignItems: 'center',
//     paddingTop: 10,
//     marginTop: 10,
//     borderTopWidth: 1,
//     borderTopColor:
//       theme.colors.earth[100],
//   },

//   orderQty: {
//     fontSize:
//       theme.fontSize.sm,
//     color:
//       theme.colors.earth[500],
//   },

//   orderTotal: {
//     fontSize:
//       theme.fontSize.md,
//     fontWeight:
//       theme.fontWeight.bold,
//     color:
//       theme.colors.brand[700],
//   },

//   // Production numbers
//   productionCard: {
//     flexDirection: 'row',
//     backgroundColor:
//       theme.colors.card,
//     borderWidth: 1,
//     borderColor:
//       theme.colors.border,
//     borderRadius:
//       theme.radius.lg,
//     padding:
//       theme.spacing.md,
//     marginTop:
//       theme.spacing.sm,
//   },

//   productionNumber: {
//     flex: 1,
//     alignItems: 'center',
//   },

//   productionNumberValue: {
//     fontSize:
//       theme.fontSize.md,
//     fontWeight:
//       theme.fontWeight.bold,
//     color:
//       theme.colors.textPrimary,
//   },

//   productionNumberLabel: {
//     fontSize:
//       theme.fontSize.xs,
//     color:
//       theme.colors.earth[400],
//     marginTop: 3,
//     textAlign: 'center',
//   },

//   productionDivider: {
//     width: 1,
//     backgroundColor:
//       theme.colors.earth[100],
//     marginVertical: 2,
//   },

//   // Deliveries
//   deliveryCard: {
//     marginBottom:
//       theme.spacing.sm,
//     padding:
//       theme.spacing.md,
//   },

//   deliveryTop: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 7,
//   },

//   deliveryCrop: {
//     flex: 1,
//     fontSize:
//       theme.fontSize.sm,
//     fontWeight:
//       theme.fontWeight.bold,
//     color:
//       theme.colors.textPrimary,
//   },

//   deliveryRoute: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     marginTop:
//       theme.spacing.md,
//   },

//   routeText: {
//     flex: 1,
//     fontSize:
//       theme.fontSize.xs,
//     color:
//       theme.colors.earth[500],
//   },

//   // Notifications
//   notificationCount: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     backgroundColor:
//       theme.colors.brand[50],
//     borderRadius: 12,
//     paddingHorizontal: 8,
//     paddingVertical: 5,
//   },

//   notificationCountText: {
//     fontSize:
//       theme.fontSize.xs,
//     color:
//       theme.colors.brand[700],
//     fontWeight:
//       theme.fontWeight.semibold,
//   },

//   notifRow: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     paddingVertical:
//       theme.spacing.sm,
//     gap: 10,
//   },

//   notifDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     marginTop: 6,
//   },

//   notifContent: {
//     flex: 1,
//   },

//   notifTitle: {
//     fontSize:
//       theme.fontSize.sm,
//     fontWeight:
//       theme.fontWeight.semibold,
//     color:
//       theme.colors.textPrimary,
//   },

//   notifMessage: {
//     fontSize:
//       theme.fontSize.sm,
//     color:
//       theme.colors.earth[500],
//     marginTop: 2,
//     lineHeight: 18,
//   },

//   notifTime: {
//     fontSize:
//       theme.fontSize.xs,
//     color:
//       theme.colors.earth[400],
//     marginTop: 4,
//   },

//   // Empty
//   emptyCard: {
//     alignItems: 'center',
//     padding:
//       theme.spacing.xl,
//     marginTop: theme.spacing.sm,
//   },

//   emptyTitle: {
//     fontSize:
//       theme.fontSize.md,
//     fontWeight:
//       theme.fontWeight.bold,
//     color:
//       theme.colors.textPrimary,
//     marginTop: 10,
//   },

//   emptyText: {
//     fontSize:
//       theme.fontSize.sm,
//     color:
//       theme.colors.earth[400],
//     textAlign: 'center',
//     lineHeight: 19,
//     marginTop: 5,
//     maxWidth: 300,
//   },

//   emptyButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     backgroundColor:
//       theme.colors.brand[600],
//     borderRadius:
//       theme.radius.md,
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     marginTop: 14,
//   },

//   emptyButtonText: {
//     color: theme.colors.white,
//     fontSize:
//       theme.fontSize.sm,
//     fontWeight:
//       theme.fontWeight.semibold,
//   },

//   pressed: {
//     opacity: 0.7,
//   },
// });

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  Bell,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Minus,
  Plus,
  ShoppingBag,
  Sprout,
  Truck,
  TrendingUp,
  Wheat,
} from 'lucide-react-native';

import { theme } from '@/theme';

import { api, currentFarmer } from '@/services/api';

import type {
  AppNotification,
  Delivery,
  FarmerProduct,
  Order,
  ProductionStage,
} from '@/types';

/* -------------------------------------------------------------------------- */
/* Navigation types                                                           */
/* -------------------------------------------------------------------------- */

type RootStackParamList = {
  MainTabs: undefined;
  RecordHarvest: undefined;
  OrderDetail: { orderId: string };
  DeliveryDetail: { deliveryId: string };
  Profile: undefined;
};

type TabParamList = {
  Home: undefined;
  Farm: undefined;
  Orders: undefined;
  Deliveries: undefined;
  Notifications: undefined;
};

type HomeNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const productionStages: ProductionStage[] = [
  'planted',
  'growing',
  'flowering',
  'maturing',
  'almost_ready',
  'ready',
  'harvested',
];

const stageLabels: Record<ProductionStage, string> = {
  planted: 'Planted',
  growing: 'Growing',
  flowering: 'Flowering',
  maturing: 'Maturing',
  almost_ready: 'Almost Ready',
  ready: 'Ready',
  harvested: 'Harvested',
};

function getStageLabel(stage: ProductionStage): string {
  return stageLabels[stage];
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(date: string): string {
  if (!date) return 'Not set';

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getReadinessLabel(percentage: number): string {
  if (percentage >= 100) return 'Harvested';
  if (percentage >= 90) return 'Ready';
  if (percentage >= 75) return 'Almost ready';
  if (percentage >= 50) return 'Maturing';
  if (percentage >= 25) return 'Growing';
  return 'Early stage';
}

function getReadinessColor(percentage: number): string {
  if (percentage >= 90) {
    return theme.colors.brand[600];
  }

  if (percentage >= 70) {
    return theme.colors.sky[600];
  }

  return theme.colors.earth[500];
}

/* -------------------------------------------------------------------------- */
/* Small reusable components                                                  */
/* -------------------------------------------------------------------------- */

function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: object;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onAction,
}: {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderText}>
        <Text style={styles.sectionTitle}>{title}</Text>

        {subtitle ? (
          <Text style={styles.sectionSubtitle}>{subtitle}</Text>
        ) : null}
      </View>

      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          style={({ pressed }) => [
            styles.sectionAction,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.sectionActionText}>{actionLabel}</Text>
          <ChevronRight
            size={16}
            color={theme.colors.brand[600]}
          />
        </Pressable>
      ) : null}
    </View>
  );
}

function StatCard({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statIcon}>{icon}</View>

      <Text style={styles.statValue}>{value}</Text>

      <Text style={styles.statLabel}>{label}</Text>

      <Text style={styles.statDescription}>{description}</Text>
    </View>
  );
}

function LoadingView() {
  return (
    <View style={styles.loadingContainer}>
      <Sprout
        size={34}
        color={theme.colors.brand[600]}
      />

      <Text style={styles.loadingText}>
        Loading your farm...
      </Text>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Home Screen                                                                */
/* -------------------------------------------------------------------------- */

export function HomeScreen() {
  const navigation = useNavigation<HomeNavigationProp>();

  const [products, setProducts] = useState<FarmerProduct[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [notifications, setNotifications] = useState<
    AppNotification[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingProductId, setUpdatingProductId] =
    useState<string | null>(null);

  /* ------------------------------------------------------------------------ */
  /* Load dashboard data                                                      */
  /* ------------------------------------------------------------------------ */

  const loadData = useCallback(async () => {
    try {
      const [
        productsData,
        ordersData,
        deliveriesData,
        notificationsData,
      ] = await Promise.all([
        api.getProducts(),
        api.getOrders(),
        api.getDeliveries(),
        api.getNotifications(),
      ]);

      setProducts(productsData);
      setOrders(ordersData);
      setDeliveries(deliveriesData);
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Failed to load farmer dashboard:', error);

      Alert.alert(
        'Unable to load dashboard',
        'There was a problem loading your farm information. Please try again.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  /* ------------------------------------------------------------------------ */
  /* Derived dashboard information                                            */
  /* ------------------------------------------------------------------------ */

  const pendingOrders = useMemo(
    () => orders.filter((order) => order.status === 'pending'),
    [orders]
  );

  const activeDeliveries = useMemo(
    () =>
      deliveries.filter(
        (delivery) =>
          delivery.status !== 'delivered'
      ),
    [deliveries]
  );

  const readyProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          product.productionStage === 'ready' ||
          product.readinessPercentage >= 90
      ),
    [products]
  );

  const totalAvailableQuantity = useMemo(
    () =>
      products.reduce(
        (total, product) =>
          total + product.availableQuantity,
        0
      ),
    [products]
  );

  const totalExpectedYield = useMemo(
    () =>
      products.reduce(
        (total, product) =>
          total + product.expectedYield,
        0
      ),
    [products]
  );

  const averageReadiness = useMemo(() => {
    if (products.length === 0) return 0;

    const total = products.reduce(
      (sum, product) =>
        sum + product.readinessPercentage,
      0
    );

    return Math.round(total / products.length);
  }, [products]);

  const unreadNotifications = useMemo(
    () =>
      notifications.filter(
        (notification) => !notification.read
      ).length,
    [notifications]
  );

  /* ------------------------------------------------------------------------ */
  /* Product readiness                                                        */
  /* ------------------------------------------------------------------------ */

  const changeReadiness = useCallback(
    async (
      product: FarmerProduct,
      amount: number
    ) => {
      if (product.productionStage === 'harvested') {
        return;
      }

      const nextValue = Math.max(
        0,
        Math.min(
          100,
          product.readinessPercentage + amount
        )
      );

      if (
        nextValue === product.readinessPercentage
      ) {
        return;
      }

      try {
        setUpdatingProductId(product.id);

        const updated =
          await api.updateProductReadiness(
            product.id,
            nextValue
          );

        setProducts((current) =>
          current.map((item) =>
            item.id === updated.id
              ? updated
              : item
          )
        );
      } catch (error) {
        console.error(
          'Failed to update readiness:',
          error
        );

        Alert.alert(
          'Update failed',
          'We could not update the product readiness.'
        );
      } finally {
        setUpdatingProductId(null);
      }
    },
    []
  );

  /* ------------------------------------------------------------------------ */
  /* Production stage                                                         */
  /* ------------------------------------------------------------------------ */

  const changeStage = useCallback(
    async (
      product: FarmerProduct,
      direction: 'previous' | 'next'
    ) => {
      if (product.productionStage === 'harvested') {
        return;
      }

      const currentIndex =
        productionStages.indexOf(
          product.productionStage
        );

      if (currentIndex === -1) return;

      const nextIndex =
        direction === 'next'
          ? Math.min(
              productionStages.length - 1,
              currentIndex + 1
            )
          : Math.max(0, currentIndex - 1);

      const nextStage =
        productionStages[nextIndex];

      if (nextStage === product.productionStage) {
        return;
      }

      try {
        setUpdatingProductId(product.id);

        const updated =
          await api.updateProductionStage(
            product.id,
            nextStage
          );

        setProducts((current) =>
          current.map((item) =>
            item.id === updated.id
              ? updated
              : item
          )
        );
      } catch (error) {
        console.error(
          'Failed to update production stage:',
          error
        );

        Alert.alert(
          'Update failed',
          'We could not update the production stage.'
        );
      } finally {
        setUpdatingProductId(null);
      }
    },
    []
  );

  /* ------------------------------------------------------------------------ */
  /* Order actions                                                            */
  /* ------------------------------------------------------------------------ */

  const approveOrder = useCallback(
    async (order: Order) => {
      try {
        const approved =
          await api.approveOrder(order.id);

        setOrders((current) =>
          current.map((item) =>
            item.id === approved.id
              ? approved
              : item
          )
        );

        const updatedProducts =
          await api.getProducts();

        setProducts(updatedProducts);

        Alert.alert(
          'Order approved',
          `${order.quantityKg} kg of ${order.cropName} has been allocated to ${order.buyerCompany}.`
        );
      } catch (error) {
        console.error(
          'Failed to approve order:',
          error
        );

        const message =
          error instanceof Error
            ? error.message
            : 'Unable to approve this order.';

        Alert.alert(
          'Cannot approve order',
          message
        );
      }
    },
    []
  );

  const denyOrder = useCallback(
    async (
      order: Order,
      reason: string
    ) => {
      try {
        const denied =
          await api.denyOrder(
            order.id,
            reason
          );

        setOrders((current) =>
          current.map((item) =>
            item.id === denied.id
              ? denied
              : item
          )
        );

        Alert.alert(
          'Order denied',
          `The order from ${order.buyerCompany} has been denied.`
        );
      } catch (error) {
        console.error(
          'Failed to deny order:',
          error
        );

        Alert.alert(
          'Cannot deny order',
          'Unable to deny this order right now.'
        );
      }
    },
    []
  );

  const confirmDenyOrder = useCallback(
    (order: Order) => {
      Alert.alert(
        'Deny this order?',
        `Order for ${formatNumber(
          order.quantityKg
        )} kg of ${order.cropName}.`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Not ready yet',
            onPress: () =>
              denyOrder(
                order,
                'Product is not ready yet.'
              ),
          },
          {
            text: 'Quantity unavailable',
            onPress: () =>
              denyOrder(
                order,
                'Requested quantity is not available.'
              ),
          },
          {
            text: 'Deny order',
            style: 'destructive',
            onPress: () =>
              denyOrder(
                order,
                'Order denied by farmer.'
              ),
          },
        ]
      );
    },
    [denyOrder]
  );

  /* ------------------------------------------------------------------------ */
  /* Navigation helpers                                                       */
  /* ------------------------------------------------------------------------ */

  const openOrder = useCallback(
    (orderId: string) => {
      navigation.navigate('OrderDetail', {
        orderId,
      });
    },
    [navigation]
  );

  const openDelivery = useCallback(
    (deliveryId: string) => {
      navigation.navigate(
        'DeliveryDetail',
        {
          deliveryId,
        }
      );
    },
    [navigation]
  );

  /* ------------------------------------------------------------------------ */
  /* Loading                                                                  */
  /* ------------------------------------------------------------------------ */

  if (loading) {
    return <LoadingView />;
  }

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.brand[600]}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}

      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.greeting}>
            Good day, {currentFarmer.name.split(' ')[0]} 👋
          </Text>

          <Text style={styles.headerTitle}>
            Your Farm Dashboard
          </Text>

          <View style={styles.locationRow}>
            <MapPin
              size={14}
              color={theme.colors.earth[500]}
            />

            <Text style={styles.locationText}>
              {currentFarmer.location}
            </Text>
          </View>
        </View>

        <Pressable
          onPress={() =>
            navigation.navigate('Profile')
          }
          style={({ pressed }) => [
            styles.profileButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.profileInitial}>
            {currentFarmer.name.charAt(0)}
          </Text>
        </Pressable>
      </View>

      {/* ------------------------------------------------------------------ */}
      {/* Farmer control message                                             */}
      {/* ------------------------------------------------------------------ */}

      <Card style={styles.controlCard}>
        <View style={styles.controlIcon}>
          <Sprout
            size={22}
            color={theme.colors.brand[600]}
          />
        </View>

        <View style={styles.controlContent}>
          <Text style={styles.controlTitle}>
            You control your farm information
          </Text>

          <Text style={styles.controlText}>
            Keep your crop stage, readiness, expected
            harvest and available quantity up to date.
            Customers can then place orders based on
            what you make available.
          </Text>
        </View>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* Stats                                                              */}
      {/* ------------------------------------------------------------------ */}

      <View style={styles.statsGrid}>
        <StatCard
          icon={
            <Sprout
              size={20}
              color={theme.colors.brand[600]}
            />
          }
          value={String(products.length)}
          label="Products"
          description="Being managed"
        />

        <StatCard
          icon={
            <TrendingUp
              size={20}
              color={theme.colors.sky[600]}
            />
          }
          value={`${averageReadiness}%`}
          label="Avg. Ready"
          description="Farm readiness"
        />

        <StatCard
          icon={
            <ShoppingBag
              size={20}
              color={theme.colors.sun[600]}
            />
          }
          value={String(pendingOrders.length)}
          label="Orders"
          description="Waiting for you"
        />

        <StatCard
          icon={
            <Wheat
              size={20}
              color={theme.colors.earth[600]}
            />
          }
          value={`${formatNumber(
            totalAvailableQuantity
          )} kg`}
          label="Available"
          description="Ready quantity"
        />
      </View>

      {/* ------------------------------------------------------------------ */}
      {/* Orders requiring action                                            */}
      {/* ------------------------------------------------------------------ */}

      <SectionHeader
        title="Orders to Review"
        subtitle={
          pendingOrders.length > 0
            ? 'Customers are waiting for your decision'
            : 'No orders are waiting for approval'
        }
        actionLabel={
          pendingOrders.length > 0
            ? 'All orders'
            : undefined
        }
        onAction={
          pendingOrders.length > 0
            ? () =>
                navigation.navigate('Orders')
            : undefined
        }
      />

      {pendingOrders.length > 0 ? (
        pendingOrders.slice(0, 3).map((order) => (
          <Card
            key={order.id}
            style={styles.orderCard}
          >
            <Pressable
              onPress={() =>
                openOrder(order.id)
              }
              style={({ pressed }) => [
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.orderTopRow}>
                <View style={styles.orderIcon}>
                  <ShoppingBag
                    size={20}
                    color={
                      theme.colors.brand[600]
                    }
                  />
                </View>

                <View style={styles.orderMain}>
                  <Text style={styles.orderCrop}>
                    {order.cropName}
                  </Text>

                  <Text style={styles.orderBuyer}>
                    {order.buyerCompany}
                  </Text>
                </View>

                <View style={styles.pendingBadge}>
                  <Text style={styles.pendingBadgeText}>
                    Pending
                  </Text>
                </View>
              </View>

              <View style={styles.orderDetails}>
                <View>
                  <Text style={styles.detailLabel}>
                    Requested
                  </Text>

                  <Text style={styles.detailValue}>
                    {formatNumber(
                      order.quantityKg
                    )}{' '}
                    kg
                  </Text>
                </View>

                <View>
                  <Text style={styles.detailLabel}>
                    Unit price
                  </Text>

                  <Text style={styles.detailValue}>
                    {formatCurrency(
                      order.unitPrice
                    )}
                  </Text>
                </View>

                <View>
                  <Text style={styles.detailLabel}>
                    Total
                  </Text>

                  <Text style={styles.detailValue}>
                    {formatCurrency(
                      order.totalValue
                    )}
                  </Text>
                </View>
              </View>
            </Pressable>

            <View style={styles.orderActions}>
              <Pressable
                onPress={() =>
                  confirmDenyOrder(order)
                }
                style={({ pressed }) => [
                  styles.denyButton,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.denyButtonText}>
                  Deny
                </Text>
              </Pressable>

              <Pressable
                onPress={() =>
                  approveOrder(order)
                }
                style={({ pressed }) => [
                  styles.approveButton,
                  pressed && styles.pressed,
                ]}
              >
                <Text
                  style={styles.approveButtonText}
                >
                  Approve
                </Text>
              </Pressable>
            </View>

            <Pressable
              onPress={() =>
                openOrder(order.id)
              }
              style={({ pressed }) => [
                styles.viewOrderButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.viewOrderText}>
                View full order
              </Text>

              <ChevronRight
                size={16}
                color={theme.colors.brand[600]}
              />
            </Pressable>
          </Card>
        ))
      ) : (
        <Card style={styles.emptyCard}>
          <ShoppingBag
            size={28}
            color={theme.colors.earth[400]}
          />

          <Text style={styles.emptyTitle}>
            No pending orders
          </Text>

          <Text style={styles.emptyText}>
            New customer orders will appear here
            when they are submitted.
          </Text>
        </Card>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* My production                                                      */}
      {/* ------------------------------------------------------------------ */}

      <SectionHeader
        title="My Production"
        subtitle="Update your crops as they develop"
        actionLabel="Manage farm"
        onAction={() =>
          navigation.navigate('Farm')
        }
      />

      {products.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Sprout
            size={30}
            color={theme.colors.earth[400]}
          />

          <Text style={styles.emptyTitle}>
            No products added yet
          </Text>

          <Text style={styles.emptyText}>
            Add your crops and production details
            from the Farm tab.
          </Text>

          <Pressable
            onPress={() =>
              navigation.navigate('Farm')
            }
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.pressed,
            ]}
          >
            <Plus
              size={18}
              color={theme.colors.white}
            />

            <Text style={styles.primaryButtonText}>
              Manage Farm
            </Text>
          </Pressable>
        </Card>
      ) : (
        products.map((product) => {
          const stageIndex =
            productionStages.indexOf(
              product.productionStage
            );

          const isUpdating =
            updatingProductId === product.id;

          const isHarvested =
            product.productionStage ===
            'harvested';

          const readinessColor =
            getReadinessColor(
              product.readinessPercentage
            );

          return (
            <Card
              key={product.id}
              style={styles.productionCard}
            >
              {/* Product heading */}

              <View style={styles.productionHeader}>
                <View style={styles.productionIcon}>
                  <Wheat
                    size={22}
                    color={
                      theme.colors.brand[600]
                    }
                  />
                </View>

                <View
                  style={
                    styles.productionHeaderText
                  }
                >
                  <Text
                    style={styles.productionName}
                  >
                    {product.cropName}
                  </Text>

                  <Text
                    style={styles.productionVariety}
                  >
                    {product.variety ||
                      product.category}
                  </Text>
                </View>

                <View
                  style={[
                    styles.stageBadge,
                    isHarvested &&
                      styles.harvestedBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.stageBadgeText,
                      isHarvested &&
                        styles.harvestedBadgeText,
                    ]}
                  >
                    {getStageLabel(
                      product.productionStage
                    )}
                  </Text>
                </View>
              </View>

              {/* Readiness */}

              <View style={styles.readinessHeader}>
                <View>
                  <Text style={styles.readinessTitle}>
                    Production readiness
                  </Text>

                  <Text
                    style={[
                      styles.readinessStatus,
                      {
                        color: readinessColor,
                      },
                    ]}
                  >
                    {getReadinessLabel(
                      product.readinessPercentage
                    )}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.readinessPercentage,
                    {
                      color: readinessColor,
                    },
                  ]}
                >
                  {product.readinessPercentage}%
                </Text>
              </View>

              <View
                style={styles.progressTrack}
              >
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${product.readinessPercentage}%`,
                      backgroundColor:
                        readinessColor,
                    },
                  ]}
                />
              </View>

              {/* Readiness controls */}

              <View
                style={styles.readinessControls}
              >
                <Pressable
                  disabled={
                    isHarvested ||
                    isUpdating ||
                    product.readinessPercentage <=
                      0
                  }
                  onPress={() =>
                    changeReadiness(
                      product,
                      -5
                    )
                  }
                  style={({ pressed }) => [
                    styles.controlButton,
                    (isHarvested ||
                      isUpdating ||
                      product.readinessPercentage <=
                        0) &&
                      styles.disabledButton,
                    pressed && styles.pressed,
                  ]}
                >
                  <Minus
                    size={18}
                    color={
                      theme.colors.textPrimary
                    }
                  />
                </Pressable>

                <Text
                  style={styles.controlHint}
                >
                  Change by 5%
                </Text>

                <Pressable
                  disabled={
                    isHarvested ||
                    isUpdating ||
                    product.readinessPercentage >=
                      100
                  }
                  onPress={() =>
                    changeReadiness(
                      product,
                      5
                    )
                  }
                  style={({ pressed }) => [
                    styles.controlButton,
                    (isHarvested ||
                      isUpdating ||
                      product.readinessPercentage >=
                        100) &&
                      styles.disabledButton,
                    pressed && styles.pressed,
                  ]}
                >
                  <Plus
                    size={18}
                    color={
                      theme.colors.textPrimary
                    }
                  />
                </Pressable>
              </View>

              {/* Production information */}

              <View
                style={styles.productionInfo}
              >
                <View
                  style={styles.infoItem}
                >
                  <Calendar
                    size={16}
                    color={
                      theme.colors.earth[500]
                    }
                  />

                  <View>
                    <Text
                      style={styles.infoLabel}
                    >
                      Expected harvest
                    </Text>

                    <Text
                      style={styles.infoValue}
                    >
                      {formatDate(
                        product.expectedHarvestDate
                      )}
                    </Text>
                  </View>
                </View>

                <View
                  style={styles.infoItem}
                >
                  <Wheat
                    size={16}
                    color={
                      theme.colors.earth[500]
                    }
                  />

                  <View>
                    <Text
                      style={styles.infoLabel}
                    >
                      Expected yield
                    </Text>

                    <Text
                      style={styles.infoValue}
                    >
                      {formatNumber(
                        product.expectedYield
                      )}{' '}
                      kg
                    </Text>
                  </View>
                </View>

                <View
                  style={styles.infoItem}
                >
                  <ShoppingBag
                    size={16}
                    color={
                      theme.colors.earth[500]
                    }
                  />

                  <View>
                    <Text
                      style={styles.infoLabel}
                    >
                      Available
                    </Text>

                    <Text
                      style={styles.infoValue}
                    >
                      {formatNumber(
                        product.availableQuantity
                      )}{' '}
                      kg
                    </Text>
                  </View>
                </View>
              </View>

              {/* Stage controls */}

              <View style={styles.stageControlSection}>
                <Text style={styles.stageControlTitle}>
                  Production stage
                </Text>

                <View
                  style={styles.stageControls}
                >
                  <Pressable
                    disabled={
                      isHarvested ||
                      isUpdating ||
                      stageIndex <= 0
                    }
                    onPress={() =>
                      changeStage(
                        product,
                        'previous'
                      )
                    }
                    style={({ pressed }) => [
                      styles.stageArrowButton,
                      (isHarvested ||
                        isUpdating ||
                        stageIndex <= 0) &&
                        styles.disabledButton,
                      pressed &&
                        styles.pressed,
                    ]}
                  >
                    <ChevronLeft
                      size={20}
                      color={
                        theme.colors.textPrimary
                      }
                    />
                  </Pressable>

                  <View
                    style={styles.stageCurrent}
                  >
                    <Text
                      style={styles.stageCurrentText}
                    >
                      {getStageLabel(
                        product.productionStage
                      )}
                    </Text>
                  </View>

                  <Pressable
                    disabled={
                      isHarvested ||
                      isUpdating ||
                      stageIndex >=
                        productionStages.length -
                          1
                    }
                    onPress={() =>
                      changeStage(
                        product,
                        'next'
                      )
                    }
                    style={({ pressed }) => [
                      styles.stageArrowButton,
                      (isHarvested ||
                        isUpdating ||
                        stageIndex >=
                          productionStages.length -
                            1) &&
                        styles.disabledButton,
                      pressed &&
                        styles.pressed,
                    ]}
                  >
                    <ChevronRight
                      size={20}
                      color={
                        theme.colors.textPrimary
                      }
                    />
                  </Pressable>
                </View>
              </View>

              {/* Manage product */}

              <Pressable
                onPress={() =>
                  navigation.navigate('Farm')
                }
                style={({ pressed }) => [
                  styles.manageProductButton,
                  pressed && styles.pressed,
                ]}
              >
                <Text
                  style={
                    styles.manageProductText
                  }
                >
                  Edit full product information
                </Text>

                <ChevronRight
                  size={17}
                  color={
                    theme.colors.brand[600]
                  }
                />
              </Pressable>
            </Card>
          );
        })
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Ready products                                                     */}
      {/* ------------------------------------------------------------------ */}

      {readyProducts.length > 0 ? (
        <>
          <SectionHeader
            title="Ready for Harvest"
            subtitle="Products approaching or at harvest"
          />

          <Card
            style={styles.readyAlertCard}
          >
            <View
              style={styles.readyAlertIcon}
            >
              <Wheat
                size={24}
                color={
                  theme.colors.brand[600]
                }
              />
            </View>

            <View
              style={styles.readyAlertContent}
            >
              <Text
                style={styles.readyAlertTitle}
              >
                {readyProducts.length}{' '}
                {readyProducts.length === 1
                  ? 'product is'
                  : 'products are'}{' '}
                ready
              </Text>

              <Text
                style={styles.readyAlertText}
              >
                {readyProducts
                  .map(
                    (product) =>
                      product.cropName
                  )
                  .join(', ')}
              </Text>
            </View>

            <Pressable
              onPress={() =>
                navigation.navigate(
                  'RecordHarvest'
                )
              }
              style={({ pressed }) => [
                styles.harvestButton,
                pressed && styles.pressed,
              ]}
            >
              <Text
                style={styles.harvestButtonText}
              >
                Record
              </Text>
            </Pressable>
          </Card>
        </>
      ) : null}

      {/* ------------------------------------------------------------------ */}
      {/* Quick farmer actions                                               */}
      {/* ------------------------------------------------------------------ */}

      <SectionHeader
        title="Farm Actions"
        subtitle="Keep your information up to date"
      />

      <View style={styles.quickActions}>
        <Pressable
          onPress={() =>
            navigation.navigate('Farm')
          }
          style={({ pressed }) => [
            styles.quickAction,
            pressed && styles.pressed,
          ]}
        >
          <View style={styles.quickActionIcon}>
            <Sprout
              size={22}
              color={theme.colors.brand[600]}
            />
          </View>

          <Text style={styles.quickActionTitle}>
            Manage Farm
          </Text>

          <Text
            style={styles.quickActionDescription}
          >
            Products, crops and production
          </Text>

          <ChevronRight
            size={18}
            color={theme.colors.earth[400]}
          />
        </Pressable>

        <Pressable
          onPress={() =>
            navigation.navigate(
              'RecordHarvest'
            )
          }
          style={({ pressed }) => [
            styles.quickAction,
            pressed && styles.pressed,
          ]}
        >
          <View style={styles.quickActionIcon}>
            <Wheat
              size={22}
              color={theme.colors.brand[600]}
            />
          </View>

          <Text style={styles.quickActionTitle}>
            Record Harvest
          </Text>

          <Text
            style={styles.quickActionDescription}
          >
            Record actual harvested quantity
          </Text>

          <ChevronRight
            size={18}
            color={theme.colors.earth[400]}
          />
        </Pressable>

        <Pressable
          onPress={() =>
            navigation.navigate(
              'Notifications'
            )
          }
          style={({ pressed }) => [
            styles.quickAction,
            pressed && styles.pressed,
          ]}
        >
          <View style={styles.quickActionIcon}>
            <Bell
              size={22}
              color={theme.colors.brand[600]}
            />

            {unreadNotifications > 0 ? (
              <View
                style={styles.notificationDot}
              />
            ) : null}
          </View>

          <Text style={styles.quickActionTitle}>
            Notifications
          </Text>

          <Text
            style={styles.quickActionDescription}
          >
            {unreadNotifications > 0
              ? `${unreadNotifications} unread notification${
                  unreadNotifications === 1
                    ? ''
                    : 's'
                }`
              : 'No new notifications'}
          </Text>

          <ChevronRight
            size={18}
            color={theme.colors.earth[400]}
          />
        </Pressable>
      </View>

      {/* ------------------------------------------------------------------ */}
      {/* Deliveries                                                         */}
      {/* ------------------------------------------------------------------ */}

      {activeDeliveries.length > 0 ? (
        <>
          <SectionHeader
            title="Active Deliveries"
            subtitle="Logistics for approved orders"
            actionLabel="View all"
            onAction={() =>
              navigation.navigate(
                'Deliveries'
              )
            }
          />

          {activeDeliveries
            .slice(0, 2)
            .map((delivery) => (
              <Pressable
                key={delivery.id}
                onPress={() =>
                  openDelivery(
                    delivery.id
                  )
                }
                style={({ pressed }) => [
                  styles.deliveryCard,
                  pressed && styles.pressed,
                ]}
              >
                <View
                  style={
                    styles.deliveryIcon
                  }
                >
                  <Truck
                    size={21}
                    color={
                      theme.colors.sky[600]
                    }
                  />
                </View>

                <View
                  style={
                    styles.deliveryContent
                  }
                >
                  <Text
                    style={
                      styles.deliveryTitle
                    }
                  >
                    {delivery.cropName}
                  </Text>

                  <Text
                    style={
                      styles.deliveryRoute
                    }
                  >
                    {delivery.pickupLocation} →{' '}
                    {delivery.deliveryLocation}
                  </Text>

                  <Text
                    style={
                      styles.deliveryStatus
                    }
                  >
                    {delivery.status
                      .replace('_', ' ')
                      .replace(
                        /^\w/,
                        (letter) =>
                          letter.toUpperCase()
                      )}
                  </Text>
                </View>

                <ChevronRight
                  size={19}
                  color={
                    theme.colors.earth[400]
                  }
                />
              </Pressable>
            ))}
        </>
      ) : null}

      {/* ------------------------------------------------------------------ */}
      {/* Farm summary                                                       */}
      {/* ------------------------------------------------------------------ */}

      <Card style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <View style={styles.summaryIcon}>
            <TrendingUp
              size={20}
              color={theme.colors.brand[600]}
            />
          </View>

          <View>
            <Text style={styles.summaryTitle}>
              Farm Production Summary
            </Text>

            <Text
              style={styles.summarySubtitle}
            >
              Current production overview
            </Text>
          </View>
        </View>

        <View style={styles.summaryRows}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Farm size
            </Text>

            <Text style={styles.summaryValue}>
              {currentFarmer.farmSizeHectares}{' '}
              hectares
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Expected total yield
            </Text>

            <Text style={styles.summaryValue}>
              {formatNumber(
                totalExpectedYield
              )}{' '}
              kg
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Products ready
            </Text>

            <Text style={styles.summaryValue}>
              {readyProducts.length}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Pending customer orders
            </Text>

            <Text style={styles.summaryValue}>
              {pendingOrders.length}
            </Text>
          </View>
        </View>
      </Card>

      {/* Bottom spacing */}

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

/* -------------------------------------------------------------------------- */
/* Styles                                                                     */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 30,
  },

  pressed: {
    opacity: 0.75,
  },

  /* Header */

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  headerText: {
    flex: 1,
    paddingRight: 12,
  },

  greeting: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.earth[500],
    marginBottom: 3,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  locationText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.earth[500],
  },

  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.brand[100],
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileInitial: {
    fontSize: 18,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.brand[700],
  },

  /* Cards */

  card: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 16,
    marginBottom: 14,
  },

  /* Farmer control */

  controlCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.brand[50],
    borderColor: theme.colors.brand[100],
    marginBottom: 16,
  },

  controlIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  controlContent: {
    flex: 1,
  },

  controlTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },

  controlText: {
    fontSize: theme.fontSize.xs,
    lineHeight: 18,
    color: theme.colors.earth[600],
  },

  /* Stats */

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 22,
  },

  statCard: {
    width: '48.5%',
    backgroundColor: theme.colors.card,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 14,
    marginBottom: 10,
  },

  statIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  statValue: {
    fontSize: 21,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
  },

  statLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginTop: 2,
  },

  statDescription: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.earth[500],
    marginTop: 2,
  },

  /* Sections */

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 10,
  },

  sectionHeaderText: {
    flex: 1,
    paddingRight: 8,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
  },

  sectionSubtitle: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.earth[500],
    marginTop: 3,
  },

  sectionAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 4,
  },

  sectionActionText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.brand[600],
  },

  /* Orders */

  orderCard: {
    paddingBottom: 12,
  },

  orderTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  orderIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: theme.colors.brand[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  orderMain: {
    flex: 1,
  },

  orderCrop: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
  },

  orderBuyer: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.earth[500],
    marginTop: 2,
  },

  pendingBadge: {
    backgroundColor: theme.colors.sun[400],
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },

  pendingBadgeText: {
    fontSize: 10,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.sun[600],
  },

  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 13,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },

  detailLabel: {
    fontSize: 10,
    color: theme.colors.earth[500],
    marginBottom: 3,
  },

  detailValue: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
  },

  orderActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },

  denyButton: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.red[400],
    alignItems: 'center',
    justifyContent: 'center',
  },

  denyButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.red[600],
  },

  approveButton: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    backgroundColor: theme.colors.brand[600],
    alignItems: 'center',
    justifyContent: 'center',
  },

  approveButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.white,
  },

  viewOrderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    gap: 3,
  },

  viewOrderText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.brand[600],
  },

  /* Production */

  productionCard: {
    padding: 15,
  },

  productionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  productionIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: theme.colors.brand[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  productionHeaderText: {
    flex: 1,
  },

  productionName: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
  },

  productionVariety: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.earth[500],
    marginTop: 2,
  },

  stageBadge: {
    backgroundColor: theme.colors.sky[400],
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },

  stageBadgeText: {
    fontSize: 10,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.sky[600],
  },

  harvestedBadge: {
    backgroundColor: theme.colors.brand[100],
  },

  harvestedBadgeText: {
    color: theme.colors.brand[700],
  },

  readinessHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
  },

  readinessTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textPrimary,
  },

  readinessStatus: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    marginTop: 2,
  },

  readinessPercentage: {
    fontSize: 24,
    fontWeight: theme.fontWeight.bold,
  },

  progressTrack: {
    height: 9,
    borderRadius: 5,
    backgroundColor: theme.colors.border,
    overflow: 'hidden',
    marginTop: 10,
  },

  progressFill: {
    height: '100%',
    borderRadius: 5,
  },

  readinessControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  controlButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  controlHint: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.earth[500],
  },

  disabledButton: {
    opacity: 0.35,
  },

  productionInfo: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: 12,
  },

  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  infoLabel: {
    fontSize: 10,
    color: theme.colors.earth[500],
  },

  infoValue: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginTop: 2,
  },

  stageControlSection: {
    marginTop: 17,
  },

  stageControlTitle: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },

  stageControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  stageArrowButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
  },

  stageCurrent: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  stageCurrentText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
  },

  manageProductButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    marginTop: 15,
    paddingTop: 13,
  },

  manageProductText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.brand[600],
  },

  /* Ready alert */

  readyAlertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.brand[50],
    borderColor: theme.colors.brand[100],
  },

  readyAlertIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  readyAlertContent: {
    flex: 1,
  },

  readyAlertTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
  },

  readyAlertText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.earth[600],
    marginTop: 2,
  },

  harvestButton: {
    backgroundColor: theme.colors.brand[600],
    borderRadius: 9,
    paddingHorizontal: 11,
    paddingVertical: 9,
  },

  harvestButtonText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.white,
  },

  /* Quick actions */

  quickActions: {
    gap: 10,
    marginBottom: 12,
  },

  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 14,
    padding: 13,
  },

  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 11,
    backgroundColor: theme.colors.brand[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
    position: 'relative',
  },

  notificationDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.red[500],
    right: 1,
    top: 1,
  },

  quickActionTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    flex: 1,
  },

  quickActionDescription: {
    position: 'absolute',
    left: 64,
    bottom: 10,
    fontSize: 10,
    color: theme.colors.earth[500],
  },

  /* Deliveries */

  deliveryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 14,
    marginBottom: 10,
  },

  deliveryIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  deliveryContent: {
    flex: 1,
  },

  deliveryTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
  },

  deliveryRoute: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.earth[500],
    marginTop: 3,
  },

  deliveryStatus: {
    fontSize: 10,
    color: theme.colors.sky[600],
    fontWeight: theme.fontWeight.semibold,
    marginTop: 3,
  },

  /* Summary */

  summaryCard: {
    marginTop: 4,
  },

  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 11,
    backgroundColor: theme.colors.brand[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  summaryTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
  },

  summarySubtitle: {
    fontSize: 10,
    color: theme.colors.earth[500],
    marginTop: 2,
  },

  summaryRows: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },

  summaryLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.earth[500],
  },

  summaryValue: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
  },

  /* Empty */

  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
  },

  emptyTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginTop: 9,
  },

  emptyText: {
    fontSize: theme.fontSize.xs,
    lineHeight: 18,
    color: theme.colors.earth[500],
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 290,
  },

  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: theme.colors.brand[600],
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 14,
  },

  primaryButtonText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.white,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  loadingText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.earth[500],
  },

  bottomSpacing: {
    height: 20,
  },
});