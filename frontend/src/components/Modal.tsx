import { type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ open, onClose, title, subtitle, children, footer, size = 'md' }: ModalProps) {
  if (!open) return null;
  const maxW = size === 'sm' ? 'max-w-md' : size === 'lg' ? 'max-w-3xl' : 'max-w-xl';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-earth-900/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className={`relative ${maxW} w-full bg-white rounded-2xl shadow-card-lg animate-scale-in max-h-[90vh] flex flex-col`}>
        <div className="flex items-start justify-between p-6 pb-4 border-b border-earth-100">
          <div>
            <h2 className="font-display text-xl font-bold text-earth-900">{title}</h2>
            {subtitle && <p className="text-sm text-earth-500 mt-1">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-earth-400 hover:bg-earth-100 hover:text-earth-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
        {footer && <div className="p-6 pt-4 border-t border-earth-100 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
}
