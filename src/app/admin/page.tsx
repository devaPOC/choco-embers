import { prisma } from '../../lib/prisma';
import { ShoppingBag, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const pendingOrdersCount = await prisma.order.count({
    where: { status: 'pending' },
  });

  const lowInventoryItems = await prisma.inventoryItem.findMany({
    where: {
      quantity: { lte: 10 },
    },
    take: 5,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-cream-100">Dashboard</h1>
        <p className="mt-2 font-body text-cream-200/70">Overview of your business</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-gold-200/20 bg-choco-400 p-6 shadow-warm-md">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-200/10 text-gold-200">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <p className="font-label text-xs uppercase tracking-wider text-cream-200/50">Pending Orders</p>
              <p className="font-display text-3xl font-semibold text-cream-100">{pendingOrdersCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-display text-xl font-semibold text-cream-100 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          Low Inventory Alerts
        </h2>
        {lowInventoryItems.length > 0 ? (
          <div className="rounded-2xl border border-gold-200/10 bg-choco-400 overflow-hidden">
            <table className="w-full text-left font-body text-sm text-cream-100">
              <thead className="bg-choco-600/50 text-cream-200/50 font-label text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-medium">Item</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Remaining</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-200/10">
                {lowInventoryItems.map((item) => (
                  <tr key={item.id} className="hover:bg-choco-300/30">
                    <td className="px-6 py-4">{item.name}</td>
                    <td className="px-6 py-4 capitalize">{item.type}</td>
                    <td className="px-6 py-4 text-yellow-500 font-semibold">
                      {item.quantity} {item.unit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-2xl border border-gold-200/20 bg-choco-400 p-8 text-center text-cream-200/50 font-body">
            All inventory levels are healthy!
          </div>
        )}
        <div className="mt-4">
          <Link href="/admin/inventory" className="font-label text-xs uppercase tracking-wider text-gold-200 hover:text-gold-100 transition-colors">
            Manage Inventory &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
