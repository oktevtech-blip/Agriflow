import { useState, useMemo } from 'react';
import { Users, Plus, Phone, MapPin, Search, Trash2, Wheat, TrendingUp } from 'lucide-react';
import { store } from '@/lib/store';
import { useAgriData } from '@/lib/hooks';
import { formatNumber, formatDate } from '@/lib/format';
import { PageHeader, EmptyState, StatusBadge, Skeleton } from '@/components/ui';
import { Modal } from '@/components/Modal';
import { HARVEST_STATUS_META } from '@/lib/status';
import type { Farmer } from '@/types';

export function Farmers() {
  const { data, loading } = useAgriData();
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [selected, setSelected] = useState<Farmer | null>(null);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = search.toLowerCase();
    return data.farmers.filter((f) => f.name.toLowerCase().includes(q) || f.location.toLowerCase().includes(q));
  }, [data, search]);

  const harvestsByFarmer = useMemo(() => {
    if (!data) return new Map<string, number>();
    const m = new Map<string, number>();
    data.harvests.forEach((h) => {
      if (h.status === 'harvested') m.set(h.farmer_id, (m.get(h.farmer_id) ?? 0) + (h.actual_yield_kg || 0));
    });
    return m;
  }, [data]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-40" />)}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Farmers"
        subtitle={`${data?.farmers.length ?? 0} registered farmers in your cooperative`}
        action={
          <button onClick={() => setAddOpen(true)} className="btn-primary">
            <Plus size={18} /> Add Farmer
          </button>
        }
      />

      <div className="relative mb-6 max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" />
        <input
          className="input pl-10"
          placeholder="Search by name or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Users size={28} />} title="No farmers found" subtitle="Try adjusting your search or add a new farmer." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((f) => {
            const totalYield = harvestsByFarmer.get(f.id) ?? 0;
            const farmerHarvests = data?.harvests.filter((h) => h.farmer_id === f.id) ?? [];
            return (
              <button
                key={f.id}
                onClick={() => setSelected(f)}
                className="card p-5 text-left hover:shadow-card-lg hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {f.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-earth-900 truncate group-hover:text-brand-700 transition-colors">{f.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-earth-500 mt-0.5">
                      <MapPin size={13} /> <span className="truncate">{f.location}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-earth-400 text-xs font-medium">Farm Size</div>
                    <div className="font-semibold text-earth-800">{formatNumber(f.farm_size_hectares)} ha</div>
                  </div>
                  <div>
                    <div className="text-earth-400 text-xs font-medium">Total Yield</div>
                    <div className="font-semibold text-earth-800">{formatNumber(totalYield)} kg</div>
                  </div>
                </div>
                {f.phone && (
                  <div className="flex items-center gap-1 text-sm text-earth-500 mt-3 pt-3 border-t border-earth-100">
                    <Phone size={13} /> {f.phone}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      <AddFarmerModal open={addOpen} onClose={() => setAddOpen(false)} onCreated={() => setAddOpen(false)} />
      {selected && <FarmerDetailModal farmer={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function AddFarmerModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({ name: '', phone: '', location: '', farm_size_hectares: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!form.name || !form.location) {
      setError('Name and location are required.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      store.addFarmer({
        name: form.name,
        phone: form.phone || null,
        location: form.location,
        farm_size_hectares: parseFloat(form.farm_size_hectares) || 0,
      });
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
      title="Add New Farmer"
      subtitle="Register a farmer in your cooperative"
      footer={
        <>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={submit} disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : 'Save Farmer'}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="label">Full Name *</label>
          <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Kwame Mensah" />
        </div>
        <div>
          <label className="label">Phone Number</label>
          <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+233 24 555 0101" />
        </div>
        <div>
          <label className="label">Location *</label>
          <input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="City, Region" />
        </div>
        <div>
          <label className="label">Farm Size (hectares)</label>
          <input className="input" type="number" value={form.farm_size_hectares} onChange={(e) => setForm({ ...form, farm_size_hectares: e.target.value })} placeholder="0" />
        </div>
        {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
      </div>
    </Modal>
  );
}

function FarmerDetailModal({ farmer, onClose }: { farmer: Farmer; onClose: () => void }) {
  const { data } = useAgriData();
  const harvests = data?.harvests.filter((h) => h.farmer_id === farmer.id) ?? [];
  const totalYield = harvests.filter((h) => h.status === 'harvested').reduce((s, h) => s + (h.actual_yield_kg || 0), 0);

  return (
    <Modal open={true} onClose={onClose} title={farmer.name} subtitle={farmer.location} size="lg">
      <div className="space-y-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-xl bg-earth-50 p-4">
            <div className="text-xs text-earth-500 font-medium">Farm Size</div>
            <div className="font-display text-lg font-bold text-earth-900">{formatNumber(farmer.farm_size_hectares)} ha</div>
          </div>
          <div className="rounded-xl bg-brand-50 p-4">
            <div className="text-xs text-brand-600 font-medium">Total Yield</div>
            <div className="font-display text-lg font-bold text-brand-700">{formatNumber(totalYield)} kg</div>
          </div>
          <div className="rounded-xl bg-sky-50 p-4">
            <div className="text-xs text-sky-600 font-medium">Active Crops</div>
            <div className="font-display text-lg font-bold text-sky-700">{harvests.length}</div>
          </div>
          <div className="rounded-xl bg-sun-50 p-4">
            <div className="text-xs text-sun-600 font-medium">Phone</div>
            <div className="font-semibold text-sun-700 text-sm mt-1">{farmer.phone ?? '—'}</div>
          </div>
        </div>

        <div>
          <h3 className="font-display font-bold text-earth-900 mb-3 flex items-center gap-2">
            <Wheat size={18} className="text-brand-600" /> Production History
          </h3>
          {harvests.length === 0 ? (
            <p className="text-earth-400 text-sm text-center py-8">No production records yet.</p>
          ) : (
            <div className="space-y-2">
              {harvests.map((h) => {
                const meta = HARVEST_STATUS_META[h.status];
                return (
                  <div key={h.id} className="flex items-center gap-3 p-3 rounded-xl bg-earth-50">
                    <div className="flex-1">
                      <div className="font-semibold text-earth-800 text-sm">{h.crop?.name}</div>
                      <div className="text-xs text-earth-500">
                        Planted {formatDate(h.planting_date)} · Expected {formatDate(h.expected_harvest_date)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-earth-800">
                        {h.status === 'harvested' ? `${formatNumber(h.actual_yield_kg)} kg` : `${formatNumber(h.expected_yield_kg)} kg (exp.)`}
                      </div>
                      {h.grade && <div className="text-xs text-earth-500">Grade {h.grade}</div>}
                    </div>
                    <StatusBadge label={meta.label} color={meta.color} dot={meta.dot} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
