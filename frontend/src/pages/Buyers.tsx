import { useState, useMemo } from 'react';
import { Store, Plus, Search, User, Package, DollarSign, ChevronRight, ShoppingBag, MapPin, Phone, Building2, TrendingUp } from 'lucide-react';
import { store } from '@/lib/store';
import { useAgriData } from '@/lib/hooks';
import { formatNumber, formatCurrency, formatWeight, formatDate } from '@/lib/format';
import { PageHeader, EmptyState, StatusBadge, Skeleton } from '@/components/ui';
import { Modal } from '@/components/Modal';
import { ORDER_STATUS_META } from '@/lib/status';
import type { Buyer, Order } from '@/types';

export function Buyers() {
  const { data, loading } = useAgriData();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Buyer | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = search.toLowerCase();
    return data.buyers.filter((b) =>
      b.name.toLowerCase().includes(q) ||
      (b.company ?? '').toLowerCase().includes(q) ||
      (b.location ?? '').toLowerCase().includes(q)
    );
  }, [data, search]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Buyers"
        subtitle="Buyer directory and order placement"
        action={
          <button onClick={() => setAddOpen(true)} className="btn-primary">
            <Plus size={18} /> Add Buyer
          </button>
        }
      />

      <div className="relative mb-6 max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" />
        <input className="input pl-10" placeholder="Search by name, company, or location..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Store size={28} />} title="No buyers found" subtitle="Add a buyer to get started." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((b) => {
            const buyerOrders = data!.orders.filter((o) => o.buyer_id === b.id);
            const activeOrders = buyerOrders.filter((o) => !['delivered', 'cancelled'].includes(o.status)).length;
            const totalSpent = buyerOrders
              .filter((o) => o.status === 'delivered')
              .reduce((s, o) => s + o.quantity_kg * o.unit_price, 0);

            return (
              <button
                key={b.id}
                onClick={() => setSelected(b)}
                className="card p-5 text-left hover:shadow-card-lg hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500 to-sky-700 flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
                    {b.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display font-bold text-earth-900 truncate">{b.name}</h3>
                    {b.company && (
                      <div className="flex items-center gap-1 text-sm text-earth-500 truncate">
                        <Building2 size={13} /> {b.company}
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-1.5 text-sm text-earth-500">
                  {b.location && (
                    <div className="flex items-center gap-1.5"><MapPin size={13} /> {b.location}</div>
                  )}
                  {b.phone && (
                    <div className="flex items-center gap-1.5"><Phone size={13} /> {b.phone}</div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-earth-100">
                  <div>
                    <div className="text-xs text-earth-400">Active Orders</div>
                    <div className="font-semibold text-earth-800">{activeOrders}</div>
                  </div>
                  <div>
                    <div className="text-xs text-earth-400">Total Spent</div>
                    <div className="font-semibold text-brand-700">{formatCurrency(totalSpent)}</div>
                  </div>
                </div>
                <div className="flex items-center justify-end mt-3 text-xs font-semibold text-brand-600 group-hover:gap-2 gap-1 transition-all">
                  View profile & place order <ChevronRight size={14} />
                </div>
              </button>
            );
          })}
        </div>
      )}

      {selected && <BuyerDetailModal buyer={selected} onClose={() => setSelected(null)} />}
      <AddBuyerModal open={addOpen} onClose={() => setAddOpen(false)} onCreated={() => setAddOpen(false)} />
    </div>
  );
}

function BuyerDetailModal({ buyer, onClose }: { buyer: Buyer; onClose: () => void }) {
  const { data } = useAgriData();
  const [placeOrderOpen, setPlaceOrderOpen] = useState(false);

  const buyerOrders = data?.orders.filter((o) => o.buyer_id === buyer.id) ?? [];

  return (
    <Modal open={true} onClose={onClose} title={buyer.name} subtitle={buyer.company ?? undefined} size="lg">
      <div className="space-y-5">
        {/* Buyer info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-earth-50 p-4">
            <div className="text-xs text-earth-500 font-medium flex items-center gap-1"><MapPin size={12} /> Location</div>
            <div className="font-semibold text-earth-900 mt-1">{buyer.location ?? '—'}</div>
          </div>
          <div className="rounded-xl bg-earth-50 p-4">
            <div className="text-xs text-earth-500 font-medium flex items-center gap-1"><Phone size={12} /> Phone</div>
            <div className="font-semibold text-earth-900 mt-1">{buyer.phone ?? '—'}</div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl bg-sky-50 p-4">
            <div className="text-xs text-sky-600 font-medium">Total Orders</div>
            <div className="font-display text-xl font-bold text-sky-700">{buyerOrders.length}</div>
          </div>
          <div className="rounded-xl bg-sun-50 p-4">
            <div className="text-xs text-sun-600 font-medium">Active</div>
            <div className="font-display text-xl font-bold text-sun-700">
              {buyerOrders.filter((o) => !['delivered', 'cancelled'].includes(o.status)).length}
            </div>
          </div>
          <div className="rounded-xl bg-brand-50 p-4">
            <div className="text-xs text-brand-600 font-medium">Delivered Value</div>
            <div className="font-display text-xl font-bold text-brand-700">
              {formatCurrency(buyerOrders.filter((o) => o.status === 'delivered').reduce((s, o) => s + o.quantity_kg * o.unit_price, 0))}
            </div>
          </div>
        </div>

        {/* Place order button */}
        <button onClick={() => setPlaceOrderOpen(true)} className="btn-primary w-full">
          <ShoppingBag size={18} /> Place New Order
        </button>

        {/* Order history */}
        <div>
          <h3 className="font-display font-bold text-earth-900 mb-3">Order History</h3>
          {buyerOrders.length === 0 ? (
            <p className="text-sm text-earth-400 text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-2">
              {buyerOrders.map((o) => {
                const meta = ORDER_STATUS_META[o.status];
                const total = o.quantity_kg * o.unit_price;
                return (
                  <div key={o.id} className="flex items-center gap-3 p-3 rounded-xl bg-earth-50">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0">
                      <Package size={18} className="text-brand-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-earth-800 text-sm">{o.crop?.name}</div>
                      <div className="text-xs text-earth-500">
                        {formatWeight(o.quantity_kg)} · {formatCurrency(o.unit_price)}/kg · {formatDate(o.created_at)}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-semibold text-brand-700 text-sm">{formatCurrency(total)}</div>
                      <StatusBadge label={meta.label} color={meta.color} dot={meta.dot} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {placeOrderOpen && (
        <PlaceOrderModal buyer={buyer} onClose={() => setPlaceOrderOpen(false)} onCreated={() => setPlaceOrderOpen(false)} />
      )}
    </Modal>
  );
}

function PlaceOrderModal({ buyer, onClose, onCreated }: { buyer: Buyer; onClose: () => void; onCreated: () => void }) {
  const { data } = useAgriData();
  const [form, setForm] = useState({
    crop_id: '',
    quantity_kg: '',
    unit_price: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedCrop = data?.crops.find((c) => c.id === form.crop_id);

  const submit = async () => {
    if (!form.crop_id || !form.quantity_kg) {
      setError('Crop and quantity are required.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      store.addOrder({
        buyer_id: buyer.id,
        crop_id: form.crop_id,
        quantity_kg: parseFloat(form.quantity_kg) || 0,
        unit_price: parseFloat(form.unit_price) || 0,
        notes: form.notes || null,
      });
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
      setSaving(false);
    }
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      title="Place Order"
      subtitle={`${buyer.name} · ${buyer.company ?? ''}`}
      footer={
        <>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={submit} disabled={saving} className="btn-primary">
            {saving ? 'Placing...' : 'Place Order'}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="rounded-xl bg-amber-50 border border-amber-100 p-3 flex items-start gap-2">
          <TrendingUp size={16} className="text-amber-600 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-700">
            This order will be sent as a request. You'll assign a farmer who produces this crop, and they must confirm before transport begins.
          </p>
        </div>
        <div>
          <label className="label">Crop *</label>
          <select className="input" value={form.crop_id} onChange={(e) => setForm({ ...form, crop_id: e.target.value })}>
            <option value="">Select crop...</option>
            {data?.crops.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.category})</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Quantity (kg) *</label>
            <input type="number" className="input" value={form.quantity_kg} onChange={(e) => setForm({ ...form, quantity_kg: e.target.value })} placeholder="0" />
          </div>
          <div>
            <label className="label">Offer Price ($/kg)</label>
            <input type="number" step="0.01" className="input" value={form.unit_price} onChange={(e) => setForm({ ...form, unit_price: e.target.value })} placeholder="0.00" />
          </div>
        </div>
        {form.quantity_kg && form.unit_price && (
          <div className="rounded-xl bg-brand-50 p-3 flex items-center justify-between">
            <span className="text-sm font-medium text-brand-700">Total Offer Value</span>
            <span className="font-display text-lg font-bold text-brand-700">
              {formatCurrency((parseFloat(form.quantity_kg) || 0) * (parseFloat(form.unit_price) || 0))}
            </span>
          </div>
        )}
        <div>
          <label className="label">Notes</label>
          <textarea className="input" rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Optional delivery requirements, quality specs..." />
        </div>
        {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
      </div>
    </Modal>
  );
}

function AddBuyerModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({ name: '', phone: '', company: '', location: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!form.name) {
      setError('Name is required.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      store.addBuyer({
        name: form.name,
        phone: form.phone || null,
        company: form.company || null,
        location: form.location || null,
      });
      setForm({ name: '', phone: '', company: '', location: '' });
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Buyer"
      subtitle="Register a new buyer in the marketplace"
      footer={
        <>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={submit} disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : 'Add Buyer'}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="label">Name *</label>
          <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Buyer name" />
        </div>
        <div>
          <label className="label">Company</label>
          <input className="input" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company name" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Phone</label>
            <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+233 ..." />
          </div>
          <div>
            <label className="label">Location</label>
            <input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="City, Region" />
          </div>
        </div>
        {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
      </div>
    </Modal>
  );
}
