import { prisma } from '../../../lib/prisma';
import { Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminMenu() {
  const categories = await prisma.category.findMany({
    include: { products: true },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-cream-100">Menu Management</h1>
          <p className="mt-2 font-body text-cream-200/70">Add, edit, and organize your products.</p>
        </div>
        <Link
          href="/admin/menu/new"
          className="flex items-center gap-2 rounded-full bg-gold-200 px-6 py-3 font-label text-sm font-semibold uppercase tracking-wider text-choco-600 transition-all hover:bg-gold-100"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      <div className="space-y-12">
        {categories.length === 0 ? (
          <div className="rounded-2xl border border-gold-200/20 bg-choco-400 p-12 text-center">
            <p className="font-body text-cream-200/70">No categories found. Create a product to get started.</p>
          </div>
        ) : (
          categories.map((category) => (
            <div key={category.id}>
              <h2 className="mb-6 font-display text-2xl font-semibold text-cream-100">{category.title}</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {category.products.map((product) => (
                  <div key={product.id} className="group relative rounded-2xl border border-gold-200/20 bg-choco-400 p-4 shadow-warm-md">
                    <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-choco-500">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-display text-lg font-semibold text-cream-100">{product.name}</h3>
                        <p className="font-label text-sm text-gold-200">₹{product.price}</p>
                      </div>
                      <p className="mt-2 line-clamp-2 font-body text-sm text-cream-200/70">{product.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
