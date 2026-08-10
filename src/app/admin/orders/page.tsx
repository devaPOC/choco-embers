import { prisma } from '../../../lib/prisma';
import OrderList from './OrderList';

export const dynamic = 'force-dynamic';

export default async function AdminOrders() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-cream-100">Orders</h1>
        <p className="mt-2 font-body text-cream-200/70">Manage incoming orders and track their status.</p>
      </div>

      <OrderList initialOrders={orders} />
    </div>
  );
}
