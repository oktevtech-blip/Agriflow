export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US').format(Math.round(n));
}

export function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

export function formatWeight(n: number): string {
  return `${formatNumber(n)} kg`;
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(dateStr: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(dateStr);
}

export const harvestStatusMeta: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  planted: { label: 'Planted', bg: '#f5f5f4', text: '#78716c', dot: '#a8a29e' },
  growing: { label: 'Growing', bg: '#e0f2fe', text: '#0284c7', dot: '#0ea5e9' },
  ready: { label: 'Ready', bg: '#fef3c7', text: '#d97706', dot: '#f59e0b' },
  harvested: { label: 'Harvested', bg: '#dcfce7', text: '#15803d', dot: '#22c55e' },
};

export const orderStatusMeta: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  pending: { label: 'Pending', bg: '#f5f5f4', text: '#78716c', dot: '#a8a29e' },
  confirmed: { label: 'Confirmed', bg: '#e0f2fe', text: '#0284c7', dot: '#0ea5e9' },
  processing: { label: 'Processing', bg: '#fef3c7', text: '#d97706', dot: '#f59e0b' },
  in_transit: { label: 'In Transit', bg: '#e0e7ff', text: '#4f46e5', dot: '#6366f1' },
  delivered: { label: 'Delivered', bg: '#dcfce7', text: '#15803d', dot: '#22c55e' },
  cancelled: { label: 'Cancelled', bg: '#fee2e2', text: '#dc2626', dot: '#ef4444' },
};

export const deliveryStatusMeta: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  assigned: { label: 'Assigned', bg: '#f5f5f4', text: '#78716c', dot: '#a8a29e' },
  pickup: { label: 'Pickup', bg: '#fef3c7', text: '#d97706', dot: '#f59e0b' },
  in_transit: { label: 'In Transit', bg: '#e0e7ff', text: '#4f46e5', dot: '#6366f1' },
  delivered: { label: 'Delivered', bg: '#dcfce7', text: '#15803d', dot: '#22c55e' },
};
