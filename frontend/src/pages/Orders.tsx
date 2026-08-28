import { useState, useMemo } from 'react';
import { ShoppingCart, Plus, Search, User, Package, DollarSign, ChevronRight, Truck } from 'lucide-react';
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
  const [addOpen, setAddOpen] = useState(false);
  const [selected, setSelected] = useState<Order | null>(null);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = search.toLowerCase();
    return data.orders.filter((o) => {
      const matchesSearch = (o.crop?.name ?? '').toLowerCase().includes(q) || (o.buyer?.name ?? '').toLowerCase().includes(q) || (o.buyer?.company ?? '').toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [data, search, statusFilter]);

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
        subtitle="Buyer marketplace and order fulfilment"
        action={
          <button onClick={() => setAddOpen(true)} className="btn-primary">
            <Plus size={18} /> New Order
          </button>
        }
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
        <EmptyState icon={<ShoppingCart size={28} />} title="No orders found" subtitle="Create a new order to get started." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((o) => {
            const meta = ORDER_STATUS_META[o.status];
            const total = o.quantity_kg * o.unit_price;
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
                <div className="flex items-center gap-1.5 text-sm text-earth-500 mb-3">
                  <User size={14} /> {o.buyer?.name}
                  {o.buyer?.company && <span className="text-earth-400">· {o.buyer.company}</span>}
                </div>
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

      <AddOrderModal open={addOpen} onClose={() => setAddOpen(false)} onCreated={() => setAddOpen(false)} />
      {selected && <OrderDetailModal order={selected} onClose={() => setSelected(null)} onUpdated={() => setSelected(null)} />}
    </div>
  );
}

function OrderDetailModal({ order, onClose, onUpdated }: { order: Order; onClose: () => void; onUpdated: () => void }) {
  const { data } = useAgriData();
  const [updating, setUpdating] = useState(false);
  const delivery = data?.deliveries.find((d) => d.order_id === order.id);

  const updateStatus = async (newStatus: OrderStatus) => {
    setUpdating(true);
    const updates: Partial<Order> = { status: newStatus };
    if (newStatus === 'confirmed') updates.confirmed_at = new Date().toISOString();
    if (newStatus === 'delivered') updates.delivered_at = new Date().toISOString();
    store.updateOrder(order.id, updates);
    onUpdated();
  };

  const currentIndex = ORDER_FLOW.indexOf(order.status as typeof ORDER_FLOW[number]);

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
            <div className="text-xs text-earth-500 font-medium">Unit Price</div>
            <div className="font-display text-lg font-bold text-earth-900">{formatCurrency(order.unit_price)}</div>
          </div>
          <div className="rounded-xl bg-brand-50 p-4">
            <div className="text-xs text-brand-600 font-medium">Total Value</div>
            <div className="font-display text-lg font-bold text-brand-700">{formatCurrency(order.quantity_kg * order.unit_price)}</div>
          </div>
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

        {/* Actions */}
        <div>
          <h3 className="font-display font-bold text-earth-900 mb-3">Update Status</h3>
          <div className="flex flex-wrap gap-2">
            {ORDER_FLOW.filter((s) => s !== order.status).map((s) => {
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
            {order.status !== 'cancelled' && (
              <button onClick={() => updateStatus('cancelled')} disabled={updating} className="btn-danger text-xs">
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

function AddOrderModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: () => void }) {
  const { data } = useAgriData();
  const [form, setForm] = useState({
    buyer_id: '',
    crop_id: '',
    quantity_kg: '',
    unit_price: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!form.buyer_id || !form.crop_id || !form.quantity_kg) {
      setError('Buyer, crop, and quantity are required.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      store.addOrder({
        buyer_id: form.buyer_id,
        crop_id: form.crop_id,
        quantity_kg: parseFloat(form.quantity_kg) || 0,
        unit_price: parseFloat(form.unit_price) || 0,
        notes: form.notes || null,
      });
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create');
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New Order"
      subtitle="Create a buyer order for available produce"
      footer={
        <>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={submit} disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : 'Create Order'}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="label">Buyer *</label>
          <select className="input" value={form.buyer_id} onChange={(e) => setForm({ ...form, buyer_id: e.target.value })}>
            <option value="">Select buyer...</option>
            {data?.buyers.map((b) => <option key={b.id} value={b.id}>{b.name} {b.company ? `· ${b.company}` : ''}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Crop *</label>
          <select className="input" value={form.crop_id} onChange={(e) => setForm({ ...form, crop_id: e.target.value })}>
            <option value="">Select crop...</option>
            {data?.crops.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Quantity (kg) *</label>
            <input type="number" className="input" value={form.quantity_kg} onChange={(e) => setForm({ ...form, quantity_kg: e.target.value })} placeholder="0" />
          </div>
          <div>
            <label className="label">Unit Price ($/kg)</label>
            <input type="number" step="0.01" className="input" value={form.unit_price} onChange={(e) => setForm({ ...form, unit_price: e.target.value })} placeholder="0.00" />
          </div>
        </div>
        <div>
          <label className="label">Notes</label>
          <textarea className="input" rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Optional..." />
        </div>
        {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
      </div>
    </Modal>
  );
}
