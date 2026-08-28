import { useState, useMemo } from 'react';
import { Truck, Plus, Search, MapPin, Package, Clock, CheckCircle2, Navigation, User, Phone } from 'lucide-react';
import { store } from '@/lib/store';
import { useAgriData } from '@/lib/hooks';
import { formatNumber, formatDateTime, formatDate } from '@/lib/format';
import { PageHeader, EmptyState, StatusBadge, Skeleton } from '@/components/ui';
import { Modal } from '@/components/Modal';
import { DELIVERY_STATUS_META, DELIVERY_FLOW } from '@/lib/status';
import type { Delivery, DeliveryStatus } from '@/types';

export function Logistics() {
  const { data, loading } = useAgriData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<DeliveryStatus | 'all'>('all');
  const [addOpen, setAddOpen] = useState(false);
  const [selected, setSelected] = useState<Delivery | null>(null);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = search.toLowerCase();
    return data.deliveries.filter((d) => {
      const matchesSearch =
        (d.pickup_location ?? '').toLowerCase().includes(q) ||
        (d.delivery_location ?? '').toLowerCase().includes(q) ||
        (d.transporter?.name ?? '').toLowerCase().includes(q) ||
        (d.order?.crop?.name ?? '').toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
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

  const statusTabs: { id: DeliveryStatus | 'all'; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'assigned', label: 'Assigned' },
    { id: 'pickup', label: 'Pickup' },
    { id: 'in_transit', label: 'In Transit' },
    { id: 'delivered', label: 'Delivered' },
  ];

  return (
    <div>
      <PageHeader
        title="Logistics"
        subtitle="Transport assignments and delivery tracking"
        action={
          <button onClick={() => setAddOpen(true)} className="btn-primary">
            <Plus size={18} /> Assign Delivery
          </button>
        }
      />

      {/* Pipeline overview */}
      <div className="card p-6 mb-6">
        <h3 className="font-display font-bold text-earth-900 mb-4">Delivery Pipeline</h3>
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {DELIVERY_FLOW.map((s, i) => {
            const meta = DELIVERY_STATUS_META[s];
            const count = data?.deliveries.filter((d) => d.status === s).length ?? 0;
            return (
              <div key={s} className="flex items-center flex-1 min-w-[120px]">
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-earth-100 flex items-center justify-center">
                    {i === 0 && <Package size={18} className="text-earth-500" />}
                    {i === 1 && <Clock size={18} className="text-sun-500" />}
                    {i === 2 && <Navigation size={18} className="text-indigo-500" />}
                    {i === 3 && <CheckCircle2 size={18} className="text-brand-500" />}
                  </div>
                  <span className="text-xs font-bold text-earth-700">{meta.label}</span>
                  <span className="text-xs text-earth-400">{count} deliveries</span>
                </div>
                {i < DELIVERY_FLOW.length - 1 && <div className="h-0.5 w-6 bg-earth-200 shrink-0" />}
              </div>
            );
          })}
        </div>
      </div>

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
        <input className="input pl-10" placeholder="Search by route, transporter, or crop..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Truck size={28} />} title="No deliveries found" subtitle="Assign a transporter to an order to create a delivery." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((d) => {
            const meta = DELIVERY_STATUS_META[d.status];
            return (
              <button
                key={d.id}
                onClick={() => setSelected(d)}
                className="card p-5 text-left hover:shadow-card-lg hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <StatusBadge label={meta.label} color={meta.color} dot={meta.dot} />
                  <span className="text-xs text-earth-400 font-medium">ETA {formatDate(d.estimated_delivery)}</span>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 text-sm">
                      <MapPin size={14} className="text-brand-500" />
                      <span className="font-semibold text-earth-800">{d.pickup_location ?? '—'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm mt-1.5">
                      <MapPin size={14} className="text-sky-500" />
                      <span className="font-semibold text-earth-800">{d.delivery_location ?? '—'}</span>
                    </div>
                  </div>
                  <div className="text-earth-300">
                    <Truck size={28} />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-earth-100 text-sm">
                  <div className="flex items-center gap-1.5 text-earth-600">
                    <Package size={14} className="text-brand-500" />
                    {d.order?.crop?.name} · {formatNumber(d.order?.quantity_kg ?? 0)} kg
                  </div>
                  <div className="flex items-center gap-1.5 text-earth-500">
                    <User size={14} /> {d.transporter?.name}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <AssignDeliveryModal open={addOpen} onClose={() => setAddOpen(false)} onCreated={() => setAddOpen(false)} />
      {selected && <DeliveryDetailModal delivery={selected} onClose={() => setSelected(null)} onUpdated={() => setSelected(null)} />}
    </div>
  );
}

function DeliveryDetailModal({ delivery, onClose, onUpdated }: { delivery: Delivery; onClose: () => void; onUpdated: () => void }) {
  const [updating, setUpdating] = useState(false);

  const updateStatus = async (newStatus: DeliveryStatus) => {
    setUpdating(true);
    const updates: Partial<Delivery> = { status: newStatus };
    if (newStatus === 'pickup') updates.picked_up_at = new Date().toISOString();
    if (newStatus === 'in_transit') updates.in_transit_at = new Date().toISOString();
    if (newStatus === 'delivered') updates.delivered_at = new Date().toISOString();
    store.updateDelivery(delivery.id, updates);
    onUpdated();
  };

  const currentIndex = DELIVERY_FLOW.indexOf(delivery.status);

  return (
    <Modal open={true} onClose={onClose} title="Delivery Details" subtitle={`${delivery.pickup_location} → ${delivery.delivery_location}`} size="lg">
      <div className="space-y-5">
        {/* Route */}
        <div className="rounded-xl bg-gradient-to-br from-brand-50 to-sky-50 p-5 border border-brand-100">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center text-white">
                <MapPin size={18} />
              </div>
              <div className="w-0.5 h-8 bg-brand-200 my-1" />
              <div className="w-10 h-10 rounded-full bg-sky-600 flex items-center justify-center text-white">
                <Navigation size={18} />
              </div>
            </div>
            <div className="flex-1 space-y-6">
              <div>
                <div className="text-xs text-earth-500 font-medium">Pickup</div>
                <div className="font-bold text-earth-900">{delivery.pickup_location ?? '—'}</div>
                {delivery.picked_up_at && <div className="text-xs text-brand-600 mt-0.5">Picked up {formatDateTime(delivery.picked_up_at)}</div>}
              </div>
              <div>
                <div className="text-xs text-earth-500 font-medium">Destination</div>
                <div className="font-bold text-earth-900">{delivery.delivery_location ?? '—'}</div>
                {delivery.delivered_at && <div className="text-xs text-brand-600 mt-0.5">Delivered {formatDateTime(delivery.delivered_at)}</div>}
              </div>
            </div>
          </div>
        </div>

        {/* Transporter */}
        <div className="rounded-xl bg-earth-50 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-earth-200 flex items-center justify-center">
              <Truck size={20} className="text-earth-600" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-earth-800">{delivery.transporter?.name}</div>
              <div className="text-sm text-earth-500">{delivery.transporter?.vehicle_type} · {delivery.transporter?.vehicle_plate}</div>
            </div>
            {delivery.transporter?.phone && (
              <div className="flex items-center gap-1 text-sm text-earth-500">
                <Phone size={14} /> {delivery.transporter.phone}
              </div>
            )}
          </div>
        </div>

        {/* Order info */}
        <div className="rounded-xl bg-earth-50 p-4">
          <div className="text-xs text-earth-500 font-medium mb-1">Order</div>
          <div className="font-semibold text-earth-800">{delivery.order?.crop?.name} — {formatNumber(delivery.order?.quantity_kg ?? 0)} kg</div>
          <div className="text-sm text-earth-500">Buyer: {delivery.order?.buyer?.name}</div>
        </div>

        {/* Progress */}
        <div>
          <h3 className="font-display font-bold text-earth-900 mb-3">Delivery Progress</h3>
          <div className="flex items-center gap-1">
            {DELIVERY_FLOW.map((s, i) => {
              const meta = DELIVERY_STATUS_META[s];
              const isDone = i <= currentIndex;
              const isCurrent = i === currentIndex;
              return (
                <div key={s} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${isDone ? 'bg-brand-600 text-white' : 'bg-earth-100 text-earth-400'} ${isCurrent ? 'ring-4 ring-brand-100' : ''}`}>
                      {i + 1}
                    </div>
                    <span className={`text-[10px] font-semibold ${isDone ? 'text-brand-700' : 'text-earth-400'}`}>{meta.label}</span>
                  </div>
                  {i < DELIVERY_FLOW.length - 1 && <div className={`flex-1 h-0.5 mx-1 ${i < currentIndex ? 'bg-brand-500' : 'bg-earth-200'}`} />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div>
          <h3 className="font-display font-bold text-earth-900 mb-3">Update Status</h3>
          <div className="flex flex-wrap gap-2">
            {DELIVERY_FLOW.filter((s) => s !== delivery.status).map((s) => {
              const meta = DELIVERY_STATUS_META[s];
              return (
                <button key={s} onClick={() => updateStatus(s)} disabled={updating} className="btn-secondary text-xs">
                  Mark as {meta.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
}

function AssignDeliveryModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: () => void }) {
  const { data } = useAgriData();
  const eligibleOrders = data?.orders.filter((o) => ['confirmed', 'processing'].includes(o.status)) ?? [];
  const [form, setForm] = useState({ order_id: '', transporter_id: '', pickup_location: '', delivery_location: '', estimated_delivery: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!form.order_id || !form.transporter_id) {
      setError('Order and transporter are required.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      store.addDelivery({
        order_id: form.order_id,
        transporter_id: form.transporter_id,
        pickup_location: form.pickup_location || null,
        delivery_location: form.delivery_location || null,
        estimated_delivery: form.estimated_delivery ? new Date(form.estimated_delivery).toISOString() : null,
      });
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign');
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Assign Delivery"
      subtitle="Link a transporter to a confirmed order"
      footer={
        <>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={submit} disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : 'Assign'}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="label">Order *</label>
          <select className="input" value={form.order_id} onChange={(e) => setForm({ ...form, order_id: e.target.value })}>
            <option value="">Select order...</option>
            {eligibleOrders.map((o) => <option key={o.id} value={o.id}>{o.crop?.name} — {o.buyer?.name} ({formatNumber(o.quantity_kg)} kg)</option>)}
          </select>
          {eligibleOrders.length === 0 && <p className="text-xs text-earth-400 mt-1">No confirmed/processing orders available.</p>}
        </div>
        <div>
          <label className="label">Transporter *</label>
          <select className="input" value={form.transporter_id} onChange={(e) => setForm({ ...form, transporter_id: e.target.value })}>
            <option value="">Select transporter...</option>
            {data?.transporters.map((t) => <option key={t.id} value={t.id}>{t.name} — {t.vehicle_type} ({formatNumber(t.capacity_kg)} kg)</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Pickup Location</label>
            <input className="input" value={form.pickup_location} onChange={(e) => setForm({ ...form, pickup_location: e.target.value })} placeholder="e.g. Kumasi" />
          </div>
          <div>
            <label className="label">Delivery Location</label>
            <input className="input" value={form.delivery_location} onChange={(e) => setForm({ ...form, delivery_location: e.target.value })} placeholder="e.g. Accra" />
          </div>
        </div>
        <div>
          <label className="label">Estimated Delivery</label>
          <input type="datetime-local" className="input" value={form.estimated_delivery} onChange={(e) => setForm({ ...form, estimated_delivery: e.target.value })} />
        </div>
        {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
      </div>
    </Modal>
  );
}
