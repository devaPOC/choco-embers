'use client';

import { useState } from 'react';
import { updateOrderStatus } from '../../actions/orders';
import { Loader2 } from 'lucide-react';

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

export default function OrderList({ initialOrders }: { initialOrders: Order[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setLoadingId(id);
    await updateOrderStatus(id, newStatus);
    setLoadingId(null);
  };

  if (initialOrders.length === 0) {
    return (
      <div className="rounded-2xl border border-gold-200/20 bg-choco-400 p-12 text-center">
        <p className="font-body text-cream-200/70">No orders yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {initialOrders.map((order) => (
        <div key={order.id} className="rounded-2xl border border-gold-200/20 bg-choco-400 p-6 shadow-warm-md">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gold-200/10 pb-4">
            <div>
              <p className="font-label text-xs uppercase tracking-wider text-gold-200">
                Order #{order.id.slice(0, 8)}
              </p>
              <h3 className="mt-1 font-display text-xl font-semibold text-cream-100">
                {order.customerName}
              </h3>
              <p className="font-body text-sm text-cream-200/70">Phone: {order.customerPhone}</p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                disabled={loadingId === order.id}
                className="rounded-xl border border-gold-200/30 bg-choco-500 px-4 py-2 font-label text-sm uppercase tracking-wider text-cream-100 focus:border-gold-200 focus:outline-none"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              {loadingId === order.id && <Loader2 className="h-4 w-4 animate-spin text-gold-200" />}
              <div className="text-right">
                <p className="font-label text-xs uppercase tracking-wider text-cream-200/50">Total</p>
                <p className="font-display text-xl font-semibold text-gold-200">₹{order.total}</p>
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <p className="mb-2 font-label text-xs uppercase tracking-wider text-cream-200/50">Items</p>
            <ul className="space-y-2">
              {order.items.map(item => (
                <li key={item.id} className="flex justify-between font-body text-sm text-cream-100">
                  <span>{item.quantity}x {item.productName}</span>
                  <span className="text-cream-200/70">₹{item.price * item.quantity}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
