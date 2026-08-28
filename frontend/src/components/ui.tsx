import { type ReactNode } from 'react';

interface BadgeProps {
  label: string;
  color: string;
  dot?: string;
}

export function StatusBadge({ label, color, dot }: BadgeProps) {
  return (
    <span className={`badge ${color}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />}
      {label}
    </span>
  );
}

export function EmptyState({ icon, title, subtitle, action }: { icon: ReactNode; title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-earth-100 flex items-center justify-center text-earth-400 mb-4">{icon}</div>
      <h3 className="font-display text-lg font-bold text-earth-800">{title}</h3>
      {subtitle && <p className="text-sm text-earth-500 mt-1 max-w-sm">{subtitle}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-earth-900">{title}</h1>
        {subtitle && <p className="text-earth-500 mt-1">{subtitle}</p>}
      </div>
      {action && <div className="flex gap-2">{action}</div>}
    </div>
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}
