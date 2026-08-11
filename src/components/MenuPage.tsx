import { ArrowLeft } from 'lucide-react';
import { BRAND } from '../data/products';
import ProductCard from './ProductCard';

type Props = {
  quantities: Record<string, number>;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onNavigateHome: () => void;
  products?: any[];
};

export default function MenuPage({ quantities, onIncrement, onDecrement, onNavigateHome, products = [] }: Props) {
  // Group products by category
  const categoriesMap = new Map();
  products.forEach(p => {
    if (!categoriesMap.has(p.categoryId)) {
      categoriesMap.set(p.categoryId, {
        id: p.category.id,
        title: p.category.title,
        subtitle: p.category.subtitle,
        products: []
      });
    }
    categoriesMap.get(p.categoryId).products.push(p);
  });

  const categories = Array.from(categoriesMap.values());

  return (
    <div className="bg-choco-500">
      {/* Sticky top nav */}
      <div className="sticky top-0 z-30 border-b border-gold-200/10 bg-choco-400/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <button
            onClick={onNavigateHome}
            className="group flex items-center gap-2 font-label text-sm font-semibold uppercase tracking-widest text-cream-100/70 transition-colors hover:text-gold-200"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
            Back
          </button>
          <div className="flex items-center gap-3">
            <img
              src="/images/logo.png"
              alt="Choco Ember logo"
              className="h-9 w-9 rounded-full object-cover ring-1 ring-gold-200/30"
            />
            <span className="font-display text-base font-semibold text-gold-200">Choco Ember</span>
          </div>
        </div>
      </div>

      {/* Header band */}
      <div className="relative overflow-hidden bg-choco-400 py-20 sm:py-28">
        <div className="absolute inset-0 opacity-25">
          <img
            src="https://images.pexels.com/photos/4110004/pexels-photo-4110004.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt=""
            className="h-full w-full object-cover"
            aria-hidden
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-choco-500/60 via-choco-500/30 to-choco-500" />
        <div className="relative mx-auto max-w-6xl px-5 text-center sm:px-8">
          <p className="mb-3 font-label text-xs font-semibold uppercase tracking-[0.3em] text-gold-200">
            The Menu
          </p>
          <h1 className="mb-4 font-display text-4xl font-semibold text-cream-100 sm:text-5xl">
            Our Handmade Chocolates
          </h1>
          <p className="mx-auto max-w-xl font-body text-base leading-relaxed text-cream-200/80 sm:text-lg">
            Choose your favourites, set quantities, and send your order straight to us on WhatsApp.
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        {categories.map((category: any, idx: number) => (
          <section
            key={category.id}
            className={idx > 0 ? 'mt-20 sm:mt-28' : ''}
            id={category.id}
          >
            <div className="mb-10 max-w-2xl">
              <div className="mb-3 flex items-center gap-3">
                <span className="h-px w-10 bg-gold-300" />
                <span className="font-label text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
                  {String(idx + 1).padStart(2, '0')}
                </span>
              </div>
              <h2 className="mb-3 font-display text-3xl font-semibold text-cream-100 sm:text-4xl">
                {category.title}
              </h2>
              <p className="font-body text-base leading-relaxed text-cream-200/70 sm:text-lg">
                {category.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {category.products.map((product: any) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantity={quantities[product.id] ?? 0}
                  onIncrement={() => onIncrement(product.id)}
                  onDecrement={() => onDecrement(product.id)}
                />
              ))}
            </div>
          </section>
        ))}

        {/* Closing note */}
        <div className="mt-20 rounded-3xl border border-gold-200/15 bg-choco-400 p-8 text-center shadow-warm-sm sm:mt-28 sm:p-12">
          <p className="mx-auto max-w-2xl font-body text-base leading-relaxed text-cream-200/80 sm:text-lg">
            All chocolates are made fresh to order in small batches. Pricing and availability are
            confirmed on WhatsApp before dispatch. We deliver across Visakhapatnam and ship pan-India.
          </p>
          <p className="mt-4 font-label text-xs font-semibold uppercase tracking-[0.2em] text-gold-200">
            - {BRAND.founder}, Founder
          </p>
        </div>
      </div>
    </div>
  );
}
