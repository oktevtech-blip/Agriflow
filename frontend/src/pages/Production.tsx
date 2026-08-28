import { useState, useMemo } from 'react';
import { Wheat, Plus, Search, Calendar, TrendingUp, Package } from 'lucide-react';
import { store } from '@/lib/store';
import { useAgriData } from '@/lib/hooks';
import { formatNumber, formatDate, formatWeight } from '@/lib/format';
import { PageHeader, EmptyState, StatusBadge, Skeleton } from '@/components/ui';
import { Modal } from '@/components/Modal';
import { HARVEST_STATUS_META } from '@/lib/status';
import { BarChart } from '@/components/Charts';
import type { HarvestStatus } from '@/types';

export function Production() {
  const { data, loading } = useAgriData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<HarvestStatus | 'all'>('all');
  const [addOpen, setAddOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = search.toLowerCase();
    return data.harvests.filter((h) => {
      const matchesSearch = (h.crop?.name ?? '').toLowerCase().includes(q) || (h.farmer?.name ?? '').toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || h.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [data, search, statusFilter]);

  const statusCounts = useMemo(() => {
    if (!data) return { planted: 0, growing: 0, ready: 0, harvested: 0 };
    const c = { planted: 0, growing: 0, ready: 0, harvested: 0 };
    data.harvests.forEach((h) => { c[h.status]++; });
    return c;
  }, [data]);

  const cropYieldData = useMemo(() => {
    if (!data) return [];
    const byCrop = new Map<string, number>();
    data.harvests.forEach((h) => {
      const name = h.crop?.name ?? 'Unknown';
      const y = h.status === 'harvested' ? h.actual_yield_kg : h.expected_yield_kg;
      byCrop.set(name, (byCrop.get(name) ?? 0) + (y || 0));
    });
    return Array.from(byCrop.entries()).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value).slice(0, 6);
  }, [data]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  const statusTabs: { id: HarvestStatus | 'all'; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: data?.harvests.length ?? 0 },
    { id: 'planted', label: 'Planted', count: statusCounts.planted },
    { id: 'growing', label: 'Growing', count: statusCounts.growing },
    { id: 'ready', label: 'Ready', count: statusCounts.ready },
    { id: 'harvested', label: 'Harvested', count: statusCounts.harvested },
  ];

  return (
    <div>
      <PageHeader
        title="Production"
        subtitle="Track planting, growing, and harvest records"
        action={
          <button onClick={() => setAddOpen(true)} className="btn-primary">
            <Plus size={18} /> Record Harvest
          </button>
        }
      />

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {statusTabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setStatusFilter(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              statusFilter === t.id ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-earth-600 border border-earth-200 hover:bg-earth-50'
            }`}
          >
            {t.label} <span className={`ml-1 ${statusFilter === t.id ? 'text-brand-100' : 'text-earth-400'}`}>({t.count})</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display font-bold text-earth-900">Yield by Crop</h3>
              <p className="text-sm text-earth-500">Expected & actual production (kg)</p>
            </div>
            <TrendingUp size={20} className="text-brand-500" />
          </div>
          <BarChart data={cropYieldData} formatValue={(n) => `${formatNumber(n)} kg`} />
        </div>
        <div className="card p-6">
          <h3 className="font-display font-bold text-earth-900 mb-4">Season Summary</h3>
          <div className="space-y-3">
            <SummaryRow icon={Package} label="Total Harvested" value={formatWeight(data?.harvests.filter((h) => h.status === 'harvested').reduce((s, h) => s + h.actual_yield_kg, 0) ?? 0)} color="text-brand-600" />
            <SummaryRow icon={Calendar} label="Ready for Harvest" value={`${statusCounts.ready} crops`} color="text-sun-600" />
            <SummaryRow icon={Wheat} label="Currently Growing" value={`${statusCounts.growing} crops`} color="text-sky-600" />
            <SummaryRow icon={Package} label="Recently Planted" value={`${statusCounts.planted} crops`} color="text-earth-600" />
          </div>
        </div>
      </div>

      <div className="relative mb-4 max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" />
        <input className="input pl-10" placeholder="Search by crop or farmer..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Wheat size={28} />} title="No production records" subtitle="Record a harvest to start tracking production." />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-earth-100 bg-earth-50/50">
                  <th className="text-left font-semibold text-earth-600 px-5 py-3">Crop</th>
                  <th className="text-left font-semibold text-earth-600 px-5 py-3">Farmer</th>
                  <th className="text-left font-semibold text-earth-600 px-5 py-3 hidden sm:table-cell">Planted</th>
                  <th className="text-left font-semibold text-earth-600 px-5 py-3 hidden md:table-cell">Expected</th>
                  <th className="text-left font-semibold text-earth-600 px-5 py-3">Yield</th>
                  <th className="text-left font-semibold text-earth-600 px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((h) => {
                  const meta = HARVEST_STATUS_META[h.status];
                  return (
                    <tr key={h.id} className="border-b border-earth-50 hover:bg-earth-50/50 transition-colors">
                      <td className="px-5 py-3.5 font-semibold text-earth-800">{h.crop?.name}</td>
                      <td className="px-5 py-3.5 text-earth-600">{h.farmer?.name}</td>
                      <td className="px-5 py-3.5 text-earth-500 hidden sm:table-cell">{formatDate(h.planting_date)}</td>
                      <td className="px-5 py-3.5 text-earth-500 hidden md:table-cell">{formatDate(h.expected_harvest_date)}</td>
                      <td className="px-5 py-3.5 font-semibold text-earth-800">
                        {h.status === 'harvested' ? `${formatNumber(h.actual_yield_kg)} kg` : `${formatNumber(h.expected_yield_kg)} kg`}
                        {h.grade && <span className="text-xs text-earth-400 ml-1">· Gr {h.grade}</span>}
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge label={meta.label} color={meta.color} dot={meta.dot} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AddHarvestModal open={addOpen} onClose={() => setAddOpen(false)} onCreated={() => setAddOpen(false)} />
    </div>
  );
}

function SummaryRow({ icon: Icon, label, value, color }: { icon: typeof Package; label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-earth-50">
      <Icon size={18} className={color} />
      <span className="text-sm text-earth-600 font-medium flex-1">{label}</span>
      <span className="font-bold text-earth-800 text-sm">{value}</span>
    </div>
  );
}

function AddHarvestModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: () => void }) {
  const { data } = useAgriData();
  const [form, setForm] = useState({
    farmer_id: '',
    crop_id: '',
    planting_date: new Date().toISOString().slice(0, 10),
    expected_harvest_date: '',
    expected_yield_kg: '',
    status: 'planted' as HarvestStatus,
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!form.farmer_id || !form.crop_id) {
      setError('Farmer and crop are required.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      store.addHarvest({
        farmer_id: form.farmer_id,
        crop_id: form.crop_id,
        planting_date: form.planting_date,
        expected_harvest_date: form.expected_harvest_date || null,
        expected_yield_kg: parseFloat(form.expected_yield_kg) || 0,
        status: form.status,
        notes: form.notes || null,
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
      title="Record Production"
      subtitle="Log a new crop planting or harvest"
      size="lg"
      footer={
        <>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={submit} disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : 'Save Record'}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Farmer *</label>
            <select className="input" value={form.farmer_id} onChange={(e) => setForm({ ...form, farmer_id: e.target.value })}>
              <option value="">Select farmer...</option>
              {data?.farmers.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Crop *</label>
            <select className="input" value={form.crop_id} onChange={(e) => setForm({ ...form, crop_id: e.target.value })}>
              <option value="">Select crop...</option>
              {data?.crops.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Planting Date</label>
            <input type="date" className="input" value={form.planting_date} onChange={(e) => setForm({ ...form, planting_date: e.target.value })} />
          </div>
          <div>
            <label className="label">Expected Harvest Date</label>
            <input type="date" className="input" value={form.expected_harvest_date} onChange={(e) => setForm({ ...form, expected_harvest_date: e.target.value })} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Expected Yield (kg)</label>
            <input type="number" className="input" value={form.expected_yield_kg} onChange={(e) => setForm({ ...form, expected_yield_kg: e.target.value })} placeholder="0" />
          </div>
          <div>
            <label className="label">Status</label>
            <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as HarvestStatus })}>
              <option value="planted">Planted</option>
              <option value="growing">Growing</option>
              <option value="ready">Ready</option>
              <option value="harvested">Harvested</option>
            </select>
          </div>
        </div>
        <div>
          <label className="label">Notes</label>
          <textarea className="input" rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Optional notes..." />
        </div>
        {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
      </div>
    </Modal>
  );
}
