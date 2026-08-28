import { useState, useEffect, type ReactNode } from 'react';
import {
  Sprout,
  LayoutDashboard,
  Users,
  Wheat,
  ShoppingCart,
  Truck,
  Sparkles,
  Menu,
  X,
  Leaf,
} from 'lucide-react';

export type Page = 'dashboard' | 'farmers' | 'production' | 'orders' | 'logistics' | 'ai';

interface NavItem {
  id: Page;
  label: string;
  icon: typeof LayoutDashboard;
  description: string;
}

const NAV: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Overview & analytics' },
  { id: 'farmers', label: 'Farmers', icon: Users, description: 'Manage farmer registry' },
  { id: 'production', label: 'Production', icon: Wheat, description: 'Crops & harvests' },
  { id: 'orders', label: 'Orders', icon: ShoppingCart, description: 'Buyer marketplace' },
  { id: 'logistics', label: 'Logistics', icon: Truck, description: 'Deliveries & transport' },
  { id: 'ai', label: 'AI Assistant', icon: Sparkles, description: 'Smart insights' },
];

interface LayoutProps {
  current: Page;
  onNavigate: (p: Page) => void;
  children: ReactNode;
}

export function Layout({ current, onNavigate, children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [current]);

  const active = NAV.find((n) => n.id === current)!;

  return (
    <div className="min-h-screen flex bg-earth-50">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-earth-200/60 fixed inset-y-0 left-0 z-30">
        <SidebarContent current={current} onNavigate={onNavigate} />
      </aside>

      {/* Sidebar — mobile drawer */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-earth-900/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-64 bg-white z-50 lg:hidden animate-slide-in">
            <SidebarContent current={current} onNavigate={onNavigate} />
          </aside>
        </>
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-earth-200/60">
          <div className="flex items-center justify-between px-4 sm:px-6 h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-earth-100 text-earth-600"
              >
                <Menu size={22} />
              </button>
              <div className="flex items-center gap-2">
                <active.icon size={20} className="text-brand-600" />
                <div>
                  <h2 className="font-display font-bold text-earth-900 text-lg leading-none">{active.label}</h2>
                  <p className="text-xs text-earth-500 mt-0.5 hidden sm:block">{active.description}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                <span className="text-xs font-semibold text-brand-700">Co-op Live</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                AF
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">{children}</main>
      </div>
    </div>
  );
}

function SidebarContent({ current, onNavigate }: { current: Page; onNavigate: (p: Page) => void }) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-earth-100">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-sm">
            <Leaf size={22} className="text-white" />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-earth-900 text-lg leading-none">AgriFlow</h1>
            <p className="text-[11px] text-earth-500 mt-0.5 font-medium tracking-wide">Farm → Market → Delivered</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map((item) => {
          const isActive = current === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                isActive
                  ? 'bg-brand-50 text-brand-700 border border-brand-200'
                  : 'text-earth-600 hover:bg-earth-50 hover:text-earth-900 border border-transparent'
              }`}
            >
              <item.icon
                size={19}
                className={isActive ? 'text-brand-600' : 'text-earth-400 group-hover:text-earth-600'}
              />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-earth-100">
        <div className="rounded-xl bg-gradient-to-br from-brand-50 to-sky-50 p-4 border border-brand-100">
          <div className="flex items-center gap-2 mb-1.5">
            <Sprout size={16} className="text-brand-600" />
            <span className="text-xs font-bold text-brand-700">Season 2026</span>
          </div>
          <p className="text-xs text-earth-600 leading-relaxed">
            Active growing season. Track harvests and fulfil orders in real time.
          </p>
        </div>
      </div>
    </div>
  );
}
