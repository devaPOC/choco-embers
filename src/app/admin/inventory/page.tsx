import { prisma } from '../../../lib/prisma';
import InventoryManager from './InventoryManager';

export const dynamic = 'force-dynamic';

export default async function AdminInventory() {
  const items = await prisma.inventoryItem.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-cream-100">Inventory Management</h1>
        <p className="mt-2 font-body text-cream-200/70">Manage ingredients and packaging stock.</p>
      </div>

      <InventoryManager initialItems={items} />
    </div>
  );
}
