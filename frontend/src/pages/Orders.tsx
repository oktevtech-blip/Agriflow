import { useState, useMemo } from 'react';
import { ShoppingCart, Plus, Search, User, Package, ChevronRight, Truck, UserCheck, Sprout, Send, CheckCircle2, XCircle } from 'lucide-react';
import { store } from '@/lib/store';
import { useAgriData } from '@/lib/hooks';
import { formatNumber, formatCurrency, formatWeight, formatDate } from '@/lib/format';
import { PageHeader, EmptyState, StatusBadge, Skeleton } from '@/components/ui';
import { Modal } from '@/components/Modal';
import { ORDER_STATUS_META, ORDER_FLOW } from '@/lib/status';
import type { Order, OrderStatus } from '@/types';

export function Orders() {
  const { data, loading } = useAgriData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [selected, setSelected] = useState<Order | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = search.toLowerCase();
    return data.orders.filter((o) => {
      const matchesSearch = (o.crop?.name ?? '').toLowerCase().includes(q) || (o.buyer?.name ?? '').toLowerCase().includes(q) || (o.buyer?.company ?? '').toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [data, search, statusFilter, refreshKey]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  const statusTabs: { id: OrderStatus | 'all'; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'requested', label: 'Requested' },
    { id: 'pending', label: 'Pending' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'processing', label: 'Processing' },
    { id: 'in_transit', label: 'In Transit' },
    { id: 'delivered', label: 'Delivered' },
  ];

  return (
    <div>
      <PageHeader
        title="Orders"
        subtitle="Manage buyer requests and farmer assignments"
      />

      <div className="flex flex-wrap gap-2 mb-4">
        {statusTabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setStatusFilter(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              statusFilter === t.id ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-earth-600 border border-earth-200 hover:bg-earth-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="relative mb-6 max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" />
        <input className="input pl-10" placeholder="Search by crop, buyer, or company..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<ShoppingCart size={28} />} title="No orders found" subtitle="Buyers can place orders from the Buyers page." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((o) => {
            const meta = ORDER_STATUS_META[o.status];
            const total = o.quantity_kg * o.unit_price;
            const needsFarmer = o.status === 'requested';
            const needsConfirm = o.status === 'pending';
            return (
              <button
                key={o.id}
                onClick={() => setSelected(o)}
                className="card p-5 text-left hover:shadow-card-lg hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <StatusBadge label={meta.label} color={meta.color} dot={meta.dot} />
                  <span className="text-xs text-earth-400 font-medium">{formatDate(o.created_at)}</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <Package size={16} className="text-brand-600" />
                  <h3 className="font-display font-bold text-earth-900">{o.crop?.name}</h3>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-earth-500 mb-2">
                  <User size={14} /> {o.buyer?.name}
                  {o.buyer?.company && <span className="text-earth-400">· {o.buyer.company}</span>}
                </div>
                {o.farmer && (
                  <div className="flex items-center gap-1.5 text-sm text-earth-500 mb-3">
                    <Sprout size={14} className="text-brand-500" /> {o.farmer.name}
                  </div>
                )}
                {(needsFarmer || needsConfirm) && (
                  <div className={`text-xs font-semibold mb-3 px-2 py-1 rounded-lg inline-flex items-center gap-1 ${
                    needsFarmer ? 'bg-amber-50 text-amber-600' : 'bg-sky-50 text-sky-600'
                  }`}>
                    {needsFarmer ? <><Send size={12} /> Awaiting farmer assignment</> : <><UserCheck size={12} /> Awaiting farmer confirmation</>}
                  </div>
                )}
                <div className="grid grid-cols-3 gap-2 text-sm pt-3 border-t border-earth-100">
                  <div>
                    <div className="text-xs text-earth-400">Quantity</div>
                    <div className="font-semibold text-earth-800">{formatNumber(o.quantity_kg)} kg</div>
                  </div>
                  <div>
                    <div className="text-xs text-earth-400">Unit Price</div>
                    <div className="font-semibold text-earth-800">{formatCurrency(o.unit_price)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-earth-400">Total</div>
                    <div className="font-semibold text-brand-700">{formatCurrency(total)}</div>
                  </div>
                </div>
                <div className="flex items-center justify-end mt-3 text-xs font-semibold text-brand-600 group-hover:gap-2 gap-1 transition-all">
                  Manage order <ChevronRight size={14} />
                </div>
              </button>
            );
          })}
        </div>
      )}

      {selected && (
        <OrderDetailModal
          order={selected}
          onClose={() => setSelected(null)}
          onUpdated={() => {
            setSelected(null);
            setRefreshKey((k) => k + 1);
          }}
        />
      )}
    </div>
  );
}

function OrderDetailModal({ order, onClose, onUpdated }: { order: Order; onClose: () => void; onUpdated: () => void }) {
  const { data } = useAgriData();
  const [assignFarmerOpen, setAssignFarmerOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const delivery = data?.deliveries.find((d) => d.order_id === order.id);

  const handleConfirm = () => {
    setUpdating(true);
    store.confirmOrder(order.id);
    setUpdating(false);
    onUpdated();
  };

  const updateStatus = (newStatus: OrderStatus) => {
    setUpdating(true);
    const updates: Partial<Order> = { status: newStatus };
    if (newStatus === 'confirmed') updates.confirmed_at = new Date().toISOString();
    if (newStatus === 'delivered') updates.delivered_at = new Date().toISOString();
    store.updateOrder(order.id, updates);
    setUpdating(false);
    onUpdated();
  };

  const currentIndex = ORDER_FLOW.indexOf(order.status as typeof ORDER_FLOW[number]);
  const isRequested = order.status === 'requested';
  const isPending = order.status === 'pending';

  // Find farmers who produce this crop (have harvests for this crop)
  const eligibleFarmers = useMemo(() => {
    if (!data) return [];
    const farmerIds = new Set(
      data.harvests
        .filter((h) => h.crop_id === order.crop_id)
        .map((h) => h.farmer_id)
    );
    return data.farmers.filter((f) => farmerIds.has(f.id));
  }, [data, order.crop_id]);

  return (
    <Modal open={true} onClose={onClose} title={`${order.crop?.name} Order`} subtitle={`${order.buyer?.name} · ${order.buyer?.company ?? ''}`} size="lg">
      <div className="space-y-5">
        {/* Order info */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl bg-earth-50 p-4">
            <div className="text-xs text-earth-500 font-medium">Quantity</div>
            <div className="font-display text-lg font-bold text-earth-900">{formatWeight(order.quantity_kg)}</div>
          </div>
          <div className="rounded-xl bg-earth-50 p-4">
            <div className="text-xs text-earth-500 font-medium">Offer Price</div>
            <div className="font-display text-lg font-bold text-earth-900">{formatCurrency(order.unit_price)}</div>
          </div>
          <div className="rounded-xl bg-brand-50 p-4">
            <div className="text-xs text-brand-600 font-medium">Total Value</div>
            <div className="font-display text-lg font-bold text-brand-700">{formatCurrency(order.quantity_kg * order.unit_price)}</div>
          </div>
        </div>

        {/* Farmer info / assignment */}
        <div className="rounded-xl border border-earth-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sprout size={18} className="text-brand-600" />
            <h3 className="font-display font-bold text-earth-900 text-sm">Farmer Assignment</h3>
          </div>
          {order.farmer ? (
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-earth-800">{order.farmer.name}</div>
                <div className="text-sm text-earth-500">{order.farmer.location} · {order.farmer.farm_size_hectares} ha</div>
              </div>
              {isPending && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-sky-600">Awaiting confirmation</span>
                  <button onClick={handleConfirm} disabled={updating} className="btn-primary text-xs">
                    <CheckCircle2 size={14} /> Confirm
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-sm text-earth-500">No farmer assigned yet</p>
              <button onClick={() => setAssignFarmerOpen(true)} className="btn-primary text-xs">
                <Send size={14} /> Assign Farmer
              </button>
            </div>
          )}
        </div>

        {/* Status flow */}
        <div>
          <h3 className="font-display font-bold text-earth-900 mb-3">Order Progress</h3>
          <div className="flex items-center gap-1">
            {ORDER_FLOW.map((s, i) => {
              const meta = ORDER_STATUS_META[s];
              const isDone = i <= currentIndex;
              const isCurrent = i === currentIndex;
              return (
                <div key={s} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isDone ? 'bg-brand-600 text-white' : 'bg-earth-100 text-earth-400'
                      } ${isCurrent ? 'ring-4 ring-brand-100' : ''}`}
                    >
                      {i + 1}
                    </div>
                    <span className={`text-[10px] font-semibold ${isDone ? 'text-brand-700' : 'text-earth-400'}`}>{meta.label}</span>
                  </div>
                  {i < ORDER_FLOW.length - 1 && <div className={`flex-1 h-0.5 mx-1 ${i < currentIndex ? 'bg-brand-500' : 'bg-earth-200'}`} />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery info */}
        {delivery && (
          <div className="rounded-xl bg-sky-50 border border-sky-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Truck size={18} className="text-sky-600" />
              <span className="font-semibold text-sky-700 text-sm">Delivery Assigned</span>
            </div>
            <div className="text-sm text-sky-600">
              {delivery.pickup_location} → {delivery.delivery_location}
            </div>
          </div>
        )}

        {/* Actions — only show for confirmed+ orders */}
        {!isRequested && !isPending && order.status !== 'cancelled' && order.status !== 'delivered' && (
          <div>
            <h3 className="font-display font-bold text-earth-900 mb-3">Update Status</h3>
            <div className="flex flex-wrap gap-2">
              {ORDER_FLOW.filter((s) => s !== order.status && s !== 'requested' && s !== 'pending').map((s) => {
                const meta = ORDER_STATUS_META[s];
                return (
                  <button
                    key={s}
                    onClick={() => updateStatus(s)}
                    disabled={updating}
                    className="btn-secondary text-xs"
                  >
                    Set to {meta.label}
                  </button>
                );
              })}
              <button onClick={() => updateStatus('cancelled')} disabled={updating} className="btn-danger text-xs">
                <XCircle size={14} /> Cancel Order
              </button>
            </div>
          </div>
        )}

        {isRequested && (
          <div className="rounded-xl bg-amber-50 border border-amber-100 p-4">
            <div className="flex items-start gap-2">
              <Send size={16} className="text-amber-600 mt-0.5 shrink-0" />
              <p className="text-sm text-amber-700">
                This order was requested by the buyer. Assign a farmer who produces {order.crop?.name} to move it forward.
              </p>
            </div>
          </div>
        )}
      </div>

      {assignFarmerOpen && (
        <AssignFarmerModal
          order={order}
          eligibleFarmers={eligibleFarmers}
          onClose={() => setAssignFarmerOpen(false)}
          onAssigned={(farmerId) => {
            store.assignFarmer(order.id, farmerId);
            setAssignFarmerOpen(false);
            onUpdated();
          }}
        />
      )}
    </Modal>
  );
}

function AssignFarmerModal({
  order,
  eligibleFarmers,
  onClose,
  onAssigned,
}: {
  order: Order;
  eligibleFarmers: ReturnType<typeof useAgriData>['data']['farmers'];
  onClose: () => void;
  onAssigned: (farmerId: string) => void;
}) {
  const { data } = useAgriData();
  const [selected, setSelected] = useState('');

  // Show eligible farmers first, then all others
  const eligibleIds = new Set(eligibleFarmers.map((f) => f.id));
  const otherFarmers = data?.farmers.filter((f) => !eligibleIds.has(f.id)) ?? [];

  return (
    <Modal
      open={true}
      onClose={onClose}
      title="Assign Farmer"
      subtitle={`Find a farmer for ${order.crop?.name} · ${formatWeight(order.quantity_kg)}`}
      size="lg"
      footer={
        <>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={() => selected && onAssigned(selected)} disabled={!selected} className="btn-primary">
            <UserCheck size={16} /> Send Request
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {eligibleFarmers.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Sprout size={14} className="text-brand-600" />
              <span className="text-sm font-semibold text-brand-700">Farmers who produce {order.crop?.name}</span>
            </div>
            <div className="space-y-2">
              {eligibleFarmers.map((f) => {
                const harvests = data!.harvests.filter((h) => h.farmer_id === f.id && h.crop_id === order.crop_id);
                const totalYield = harvests.reduce((s, h) => s + (h.status === 'harvested' ? h.actual_yield_kg : h.expected_yield_kg), 0);
                return (
                  <button
                    key={f.id}
                    onClick={() => setSelected(f.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                      selected === f.id ? 'border-brand-500 bg-brand-50' : 'border-earth-200 hover:bg-earth-50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center shrink-0">
                      <Sprout size={18} className="text-brand-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-earth-800">{f.name}</div>
                      <div className="text-xs text-earth-500">{f.location} · {f.farm_size_hectares} ha</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs text-earth-400">Produces</div>
                      <div className="text-sm font-semibold text-brand-600">{formatWeight(totalYield)}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {otherFarmers.length > 0 && (
          <div>
            <div className="text-sm font-semibold text-earth-500 mb-2">Other farmers</div>
            <div className="space-y-2">
              {otherFarmers.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelected(f.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                    selected === f.id ? 'border-brand-500 bg-brand-50' : 'border-earth-200 hover:bg-earth-50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-earth-100 flex items-center justify-center shrink-0">
                    <User size={18} className="text-earth-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-earth-800">{f.name}</div>
                    <div className="text-xs text-earth-500">{f.location} · {f.farm_size_hectares} ha</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {eligibleFarmers.length === 0 && otherFarmers.length === 0 && (
          <p className="text-sm text-earth-400 text-center py-8">No farmers available</p>
        )}
      </div>
    </Modal>
  );
}
