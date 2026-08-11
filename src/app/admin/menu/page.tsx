import { prisma } from '../../../lib/prisma';
import { Plus, Trash2, Pencil } from 'lucide-react';
import Link from 'next/link';
import { deleteProduct } from '../../../actions/menu';

export const dynamic = 'force-dynamic';

export default async function AdminMenu() {
  const categories = await prisma.category.findMany({
    include: { products: true },
    orderBy: { title: 'asc' },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-gold-200/10 pb-6">
        <div>
          <h1 className="font-display text-3xl font-semibold text-cream-100">Menu Management</h1>
          <p className="mt-2 font-body text-cream-200/70">Add, edit, and organize your products.</p>
        </div>
        <Link
          href="/admin/menu/new"
          className="flex items-center gap-2 rounded-full bg-gold-200 px-6 py-3 font-label text-sm font-semibold uppercase tracking-wider text-choco-600 shadow-lg shadow-gold-200/20 transition-all hover:bg-gold-100"
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
            <div key={category.id} className="relative">
              <div className="mb-6 flex items-center gap-4">
                <h2 className="font-display text-2xl font-semibold text-cream-100">{category.title}</h2>
                <span className="rounded-full border border-gold-200/20 bg-choco-400 px-3 py-1 font-label text-xs text-gold-200">
                  {category.products.length} {category.products.length === 1 ? 'Item' : 'Items'}
                </span>
              </div>
              
              {category.products.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gold-200/20 bg-choco-500/30 p-8 text-center">
                  <p className="font-body text-sm text-cream-200/40">No products in this category.</p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {category.products.map((product) => (
                    <div key={product.id} className="group flex flex-col overflow-hidden rounded-2xl border border-gold-200/10 bg-choco-400 transition-all hover:border-gold-200/30 hover:shadow-warm-lg">
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-choco-500">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Overlay Actions */}
                        <div className="absolute right-3 top-3 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                          <Link
                            href={`/admin/menu/${product.id}/edit`}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-choco-600/90 text-gold-200 backdrop-blur-sm transition-colors hover:bg-gold-200 hover:text-choco-600"
                            title="Edit Product"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <form action={deleteProduct.bind(null, product.id)}>
                            <button
                              type="submit"
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-choco-600/90 text-red-400 backdrop-blur-sm transition-colors hover:bg-red-500 hover:text-white"
                              title="Delete Product"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </form>
                        </div>
                      </div>
                      
                      <div className="flex flex-1 flex-col p-5">
                        <div className="mb-2 flex items-start justify-between gap-4">
                          <h3 className="line-clamp-1 font-display text-lg font-semibold text-cream-100">{product.name}</h3>
                          <p className="shrink-0 font-label text-sm font-bold text-gold-200">₹{product.price}</p>
                        </div>
                        <p className="flex-1 line-clamp-2 font-body text-sm text-cream-200/60">{product.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
