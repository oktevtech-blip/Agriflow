import { useMemo } from 'react';
import { Users, Wheat, ShoppingCart, Truck, TrendingUp, Package, Clock, CheckCircle2, Sprout, DollarSign } from 'lucide-react';
import { useAgriData } from '@/lib/hooks';
import { formatNumber, formatCurrency, formatWeight } from '@/lib/format';
import { ORDER_STATUS_META, HARVEST_STATUS_META } from '@/lib/status';
import { BarChart, DonutChart, LineChart } from '@/components/Charts';
import { Skeleton } from '@/components/ui';
import type { Page } from '@/components/Layout';

export function Dashboard({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const { data, loading } = useAgriData();

  const stats = useMemo(() => {
    if (!data) return null;
    const totalFarmers = data.farmers.length;
    const totalHectares = data.farmers.reduce((s, f) => s + (f.farm_size_hectares || 0), 0);
    const totalHarvested = data.harvests
      .filter((h) => h.status === 'harvested')
      .reduce((s, h) => s + (h.actual_yield_kg || 0), 0);
    const totalExpected = data.harvests.reduce((s, h) => s + (h.expected_yield_kg || 0), 0);
    const pendingOrders = data.orders.filter((o) => o.status === 'pending').length;
    const activeOrders = data.orders.filter((o) => !['delivered', 'cancelled'].includes(o.status)).length;
    const totalRevenue = data.orders
      .filter((o) => o.status === 'delivered')
      .reduce((s, o) => s + o.quantity_kg * o.unit_price, 0);
    const potentialRevenue = data.orders
      .filter((o) => !['cancelled'].includes(o.status))
      .reduce((s, o) => s + o.quantity_kg * o.unit_price, 0);
    const pendingDeliveries = data.deliveries.filter((d) => d.status !== 'delivered').length;

    return {
      totalFarmers,
      totalHectares,
      totalHarvested,
      totalExpected,
      pendingOrders,
      activeOrders,
      totalRevenue,
      potentialRevenue,
      pendingDeliveries,
    };
  }, [data]);

  const cropProduction = useMemo(() => {
    if (!data) return [];
    const byCrop = new Map<string, number>();
    data.harvests.forEach((h) => {
      const name = h.crop?.name ?? 'Unknown';
      const yieldKg = h.status === 'harvested' ? h.actual_yield_kg : h.expected_yield_kg;
      byCrop.set(name, (byCrop.get(name) ?? 0) + (yieldKg || 0));
    });
    return Array.from(byCrop.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 7);
  }, [data]);

  const orderStatusDist = useMemo(() => {
    if (!data) return [];
    const colors: Record<string, string> = {
      pending: '#a8a29e',
      confirmed: '#0ea5e9',
      processing: '#f59e0b',
      in_transit: '#6366f1',
      delivered: '#16a34a',
      cancelled: '#ef4444',
    };
    const counts = new Map<string, number>();
    data?.orders.forEach((o) => counts.set(o.status, (counts.get(o.status) ?? 0) + 1));
    return Array.from(counts.entries()).map(([label, value]) => ({
      label: ORDER_STATUS_META[label as keyof typeof ORDER_STATUS_META]?.label ?? label,
      value,
      color: colors[label] ?? '#a8a29e',
    }));
  }, [data]);

  const monthlyTrend = useMemo(() => {
    if (!data) return [];
    const months = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
    const values = [1200, 3400, 2800, 5100, 4300, 6200];
    return months.map((label, i) => ({ label, value: values[i] }));
  }, [data]);

  const recentOrders = useMemo(() => {
    if (!data) return [];
    return [...data.orders]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);
  }, [data]);

  if (loading || !stats) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
        </div>
      </div>
    );
  }

  const cards = [
    { label: 'Total Farmers', value: formatNumber(stats.totalFarmers), sub: `${formatNumber(stats.totalHectares)} ha cultivated`, icon: Users, color: 'from-brand-500 to-brand-700' },
    { label: 'Total Production', value: formatWeight(stats.totalHarvested), sub: `${formatWeight(stats.totalExpected)} expected`, icon: Wheat, color: 'from-sun-500 to-sun-600' },
    { label: 'Active Orders', value: formatNumber(stats.activeOrders), sub: `${stats.pendingOrders} pending`, icon: ShoppingCart, color: 'from-sky-500 to-sky-600' },
    { label: 'Revenue (Delivered)', value: formatCurrency(stats.totalRevenue), sub: `${formatCurrency(stats.potentialRevenue)} pipeline`, icon: DollarSign, color: 'from-emerald-500 to-emerald-700' },
  ];

  return (
    <div className="space-y-6">
      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-emerald-800 p-6 sm:p-8 text-white shadow-card-lg">
        <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute right-12 bottom-0 w-32 h-32 rounded-full bg-sun-500/20 blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Sprout size={18} className="text-brand-200" />
            <span className="text-sm font-semibold text-brand-100">2026 Growing Season</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold mb-1">Welcome back, Cooperative Manager</h2>
          <p className="text-brand-100 max-w-lg">
            You have <span className="font-bold text-white">{stats.pendingOrders} pending orders</span> and{' '}
            <span className="font-bold text-white">{stats.pendingDeliveries} active deliveries</span> to track today.
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            <button onClick={() => onNavigate('orders')} className="px-4 py-2 rounded-xl bg-white text-brand-700 text-sm font-bold hover:bg-brand-50 transition-colors active:scale-95">
              Review Orders
            </button>
            <button onClick={() => onNavigate('logistics')} className="px-4 py-2 rounded-xl bg-white/15 text-white text-sm font-bold border border-white/25 hover:bg-white/25 transition-colors active:scale-95">
              Track Deliveries
            </button>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <div key={i} className="stat-card">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-earth-500">{c.label}</span>
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center shadow-sm`}>
                <c.icon size={18} className="text-white" />
              </div>
            </div>
            <div className="font-display text-2xl font-bold text-earth-900">{c.value}</div>
            <div className="text-xs text-earth-400 font-medium">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display font-bold text-earth-900">Production by Crop</h3>
              <p className="text-sm text-earth-500">Total yield (kg) per crop</p>
            </div>
            <TrendingUp size={20} className="text-brand-500" />
          </div>
          <BarChart data={cropProduction} formatValue={(n) => `${formatNumber(n)} kg`} />
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display font-bold text-earth-900">Order Status Distribution</h3>
              <p className="text-sm text-earth-500">All orders by current status</p>
            </div>
            <Package size={20} className="text-sky-500" />
          </div>
          {orderStatusDist.length > 0 ? (
            <div className="flex justify-center py-2">
              <DonutChart data={orderStatusDist} centerValue={formatNumber(data!.orders.length)} centerLabel="Total Orders" />
            </div>
          ) : (
            <p className="text-earth-400 text-sm text-center py-12">No orders yet</p>
          )}
        </div>
      </div>

      {/* Monthly trend + recent orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6 lg:col-span-1">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display font-bold text-earth-900">Monthly Production</h3>
              <p className="text-sm text-earth-500">Harvest output trend</p>
            </div>
            <TrendingUp size={20} className="text-sun-500" />
          </div>
          <LineChart data={monthlyTrend} formatValue={(n) => `${(n / 1000).toFixed(1)}k`} />
        </div>

        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display font-bold text-earth-900">Recent Orders</h3>
              <p className="text-sm text-earth-500">Latest buyer activity</p>
            </div>
            <button onClick={() => onNavigate('orders')} className="text-sm font-semibold text-brand-600 hover:text-brand-700">
              View all →
            </button>
          </div>
          <div className="space-y-3">
            {recentOrders.map((o) => {
              const meta = ORDER_STATUS_META[o.status];
              return (
                <div key={o.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-earth-50 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-earth-100 flex items-center justify-center shrink-0">
                    <ShoppingCart size={18} className="text-earth-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-earth-800 text-sm truncate">
                      {o.crop?.name} — {o.buyer?.name}
                    </div>
                    <div className="text-xs text-earth-500">
                      {formatWeight(o.quantity_kg)} · {formatCurrency(o.unit_price)}/kg
                    </div>
                  </div>
                  <span className={`badge ${meta.color} shrink-0`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                    {meta.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick status row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <QuickStat icon={Clock} label="Pending Deliveries" value={stats.pendingDeliveries} color="text-sun-600" bg="bg-sun-50" />
        <QuickStat icon={CheckCircle2} label="Completed Harvests" value={data!.harvests.filter((h) => h.status === 'harvested').length} color="text-brand-600" bg="bg-brand-50" />
        <QuickStat icon={Sprout} label="Crops Ready for Harvest" value={data!.harvests.filter((h) => h.status === 'ready').length} color="text-sky-600" bg="bg-sky-50" />
      </div>
    </div>
  );
}

function QuickStat({ icon: Icon, label, value, color, bg }: { icon: typeof Clock; label: string; value: number; color: string; bg: string }) {
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
        <Icon size={22} className={color} />
      </div>
      <div>
        <div className="font-display text-xl font-bold text-earth-900">{value}</div>
        <div className="text-sm text-earth-500 font-medium">{label}</div>
      </div>
    </div>
  );
}
