'use client';

import { useState, useMemo } from 'react';
import { updateOrderStatus } from '../../actions/orders';
import {
  Loader2,
  Search,
  Eye,
  X,
  ChevronDown,
  Clock,
  CheckCircle2,
  XCircle,
  ShoppingBag,
  Phone,
  User,
  Package,
  CalendarDays,
} from 'lucide-react';

type OrderItem = {
  id: string;
  productName: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  status: string;
  total: number;
  createdAt: Date;
  items: OrderItem[];
};

type Tab = 'all' | 'current' | 'past';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: typeof Clock }> = {
  pending:   { label: 'Pending',   color: 'text-yellow-400',  bg: 'bg-yellow-400/10 border-yellow-400/25', icon: Clock },
  approved:  { label: 'Approved',  color: 'text-blue-400',    bg: 'bg-blue-400/10 border-blue-400/25',     icon: CheckCircle2 },
  completed: { label: 'Completed', color: 'text-green-400',   bg: 'bg-green-400/10 border-green-400/25',   icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', color: 'text-red-400',     bg: 'bg-red-400/10 border-red-400/25',       icon: XCircle },
  refunded:  { label: 'Refunded',  color: 'text-orange-400',  bg: 'bg-orange-400/10 border-orange-400/25', icon: XCircle },
};

function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-label text-[11px] font-semibold uppercase tracking-wider ${config.color} ${config.bg}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatRelativeTime(date: Date) {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export default function OrderList({ initialOrders }: { initialOrders: Order[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusDropdownId, setStatusDropdownId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setStatusDropdownId(null);
    setLoadingId(id);
    await updateOrderStatus(id, newStatus);
    setLoadingId(null);
  };

  // Filter orders by tab
  const tabFiltered = useMemo(() => {
    if (activeTab === 'current') return initialOrders.filter(o => o.status === 'pending' || o.status === 'approved');
    if (activeTab === 'past') return initialOrders.filter(o => o.status === 'completed' || o.status === 'cancelled' || o.status === 'refunded');
    return initialOrders;
  }, [initialOrders, activeTab]);

  // Filter by search
  const filtered = useMemo(() => {
    if (!search.trim()) return tabFiltered;
    const q = search.toLowerCase();
    return tabFiltered.filter(o =>
      o.customerName.toLowerCase().includes(q) ||
      o.customerPhone.includes(q) ||
      o.id.toLowerCase().includes(q) ||
      o.items.some(i => i.productName.toLowerCase().includes(q))
    );
  }, [tabFiltered, search]);

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'all', label: 'All Orders', count: initialOrders.length },
    { key: 'current', label: 'Current', count: initialOrders.filter(o => o.status === 'pending' || o.status === 'approved').length },
    { key: 'past', label: 'Past', count: initialOrders.filter(o => o.status === 'completed' || o.status === 'cancelled' || o.status === 'refunded').length },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-1 rounded-xl border border-gold-200/10 bg-choco-400 p-1 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 font-label text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-gold-200 text-choco-600 shadow-warm-sm'
                : 'text-cream-200/60 hover:text-cream-100 hover:bg-choco-300/40'
            }`}
          >
            {tab.label}
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
              activeTab === tab.key
                ? 'bg-choco-600/20 text-choco-600'
                : 'bg-cream-100/10 text-cream-200/50'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cream-200/40" />
        <input
          type="text"
          placeholder="Search by name, phone, order ID, or product..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gold-200/15 bg-choco-400 py-3 pl-11 pr-4 font-body text-sm text-cream-100 placeholder:text-cream-200/30 focus:border-gold-200/40 focus:outline-none focus:ring-1 focus:ring-gold-200/20 transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-cream-200/40 hover:text-cream-100 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Results count */}
      <p className="font-label text-xs uppercase tracking-wider text-cream-200/40">
        {filtered.length} {filtered.length === 1 ? 'order' : 'orders'}
        {search && ` matching "${search}"`}
      </p>

      {/* Order list */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-gold-200/10 bg-choco-400 p-12 text-center">
          <ShoppingBag className="mx-auto mb-3 h-8 w-8 text-cream-200/30" />
          <p className="font-body text-cream-200/50">
            {search ? 'No orders match your search.' : 'No orders in this category.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const isExpanded = expandedId === order.id;
            const isLoading = loadingId === order.id;
            const showStatusDropdown = statusDropdownId === order.id;

            return (
              <div
                key={order.id}
                className={`rounded-2xl border bg-choco-400 shadow-warm-sm transition-all duration-200 ${
                  isExpanded ? 'border-gold-200/25 shadow-warm-md' : 'border-gold-200/10 hover:border-gold-200/20'
                }`}
              >
                {/* Condensed row */}
                <div className="flex flex-wrap items-center gap-3 p-4 sm:gap-4 sm:px-5">
                  {/* Order ID + Time */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-label text-xs font-semibold uppercase tracking-wider text-gold-200">
                        #{order.id.slice(0, 8)}
                      </span>
                      <span className="font-label text-[10px] uppercase tracking-wider text-cream-200/35">
                        {formatRelativeTime(order.createdAt)}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate font-display text-sm font-semibold text-cream-100 sm:text-base">
                      {order.customerName}
                    </p>
                  </div>

                  {/* Items count */}
                  <div className="hidden sm:flex items-center gap-1.5 text-cream-200/50">
                    <Package className="h-3.5 w-3.5" />
                    <span className="font-label text-xs uppercase tracking-wider">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>

                  {/* Total */}
                  <div className="text-right">
                    <span className="font-display text-base font-semibold text-cream-100 sm:text-lg">
                      ₹{order.total}
                    </span>
                  </div>

                  {/* Status badge */}
                  <StatusBadge status={order.status} />

                  {/* View button */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : order.id)}
                    className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all ${
                      isExpanded
                        ? 'border-gold-200/30 bg-gold-200 text-choco-600'
                        : 'border-gold-200/20 text-gold-200 hover:bg-gold-200/10'
                    }`}
                    aria-label={isExpanded ? 'Close order details' : 'View order details'}
                  >
                    {isExpanded ? <X className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t border-gold-200/10 px-4 pb-5 pt-4 sm:px-5 animate-[fadeIn_0.2s_ease-out]">
                    <div className="grid gap-5 sm:grid-cols-2">
                      {/* Customer info */}
                      <div className="space-y-3">
                        <p className="font-label text-[10px] font-semibold uppercase tracking-[0.2em] text-cream-200/40">Customer Details</p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2.5">
                            <User className="h-3.5 w-3.5 text-gold-200/70" />
                            <span className="font-body text-sm text-cream-100">{order.customerName}</span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <Phone className="h-3.5 w-3.5 text-gold-200/70" />
                            <a
                              href={`tel:${order.customerPhone}`}
                              className="font-body text-sm text-gold-200 hover:text-gold-100 transition-colors"
                            >
                              {order.customerPhone}
                            </a>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <CalendarDays className="h-3.5 w-3.5 text-gold-200/70" />
                            <span className="font-body text-sm text-cream-200/70">{formatDate(order.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Order items */}
                      <div>
                        <p className="mb-3 font-label text-[10px] font-semibold uppercase tracking-[0.2em] text-cream-200/40">Order Items</p>
                        <div className="space-y-2 rounded-xl border border-gold-200/10 bg-choco-300/30 p-3">
                          {order.items.map(item => (
                            <div key={item.id} className="flex items-center justify-between gap-3">
                              <span className="font-body text-sm text-cream-100">
                                <span className="font-semibold text-gold-200">{item.quantity}×</span> {item.productName}
                              </span>
                              <span className="font-label text-xs text-cream-200/60 whitespace-nowrap">
                                ₹{item.price * item.quantity}
                              </span>
                            </div>
                          ))}
                          <div className="mt-2 flex justify-between border-t border-gold-200/10 pt-2">
                            <span className="font-label text-xs font-semibold uppercase tracking-wider text-cream-200/50">Total</span>
                            <span className="font-display text-base font-semibold text-gold-200">₹{order.total}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action row */}
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gold-200/10 pt-4">
                      {/* Status changer */}
                      <div className="relative">
                        <button
                          onClick={() => setStatusDropdownId(showStatusDropdown ? null : order.id)}
                          disabled={isLoading}
                          className="flex items-center gap-2 rounded-xl border border-gold-200/20 bg-choco-500 px-4 py-2.5 font-label text-xs font-semibold uppercase tracking-wider text-cream-100 transition-colors hover:border-gold-200/40 disabled:opacity-50"
                        >
                          {isLoading ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-gold-200" />
                          ) : (
                            <>
                              Change Status
                              <ChevronDown className={`h-3.5 w-3.5 text-gold-200 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
                            </>
                          )}
                        </button>

                        {showStatusDropdown && (
                          <div className="absolute left-0 top-full z-20 mt-2 w-44 rounded-xl border border-gold-200/20 bg-choco-400 py-1.5 shadow-warm-lg animate-[fadeIn_0.15s_ease-out]">
                            {Object.entries(STATUS_CONFIG).map(([value, config]) => {
                              const Icon = config.icon;
                              const isCurrent = order.status === value;
                              return (
                                <button
                                  key={value}
                                  onClick={() => handleStatusChange(order.id, value)}
                                  disabled={isCurrent}
                                  className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left font-label text-xs uppercase tracking-wider transition-colors ${
                                    isCurrent
                                      ? 'text-cream-200/30 cursor-default'
                                      : `${config.color} hover:bg-choco-300/40`
                                  }`}
                                >
                                  <Icon className="h-3.5 w-3.5" />
                                  {config.label}
                                  {isCurrent && <span className="ml-auto text-[10px] text-cream-200/25">Current</span>}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* WhatsApp link */}
                      <a
                        href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${order.customerName}, regarding your order #${order.id.slice(0, 8)} at Choco Ember...`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-xl bg-green-600/20 border border-green-500/25 px-4 py-2.5 font-label text-xs font-semibold uppercase tracking-wider text-green-400 transition-colors hover:bg-green-600/30"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        WhatsApp
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
