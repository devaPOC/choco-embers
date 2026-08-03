import { Minus, Plus } from 'lucide-react';
import type { Product } from '../data/products';

type Props = {
  product: Product;
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
};

export default function ProductCard({ product, quantity, onIncrement, onDecrement }: Props) {
  return (
    <div className="card-product group flex flex-col">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-choco-500/40 to-transparent" />
        {/* Accent dot */}
        <div
          className="absolute right-3 top-3 h-3 w-3 rounded-full ring-2 ring-cream-100/30"
          style={{ backgroundColor: product.accent }}
          aria-hidden
        />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 font-display text-xl font-semibold text-cream-100">{product.name}</h3>
        <p className="mb-5 flex-1 font-body text-sm leading-relaxed text-cream-200/60">
          {product.description}
        </p>

        {/* Quantity selector */}
        <div className="flex items-center justify-between">
          <span className="font-label text-xs font-semibold uppercase tracking-wider text-gold-200">
            Quantity
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onDecrement}
              disabled={quantity === 0}
              aria-label={`Decrease ${product.name} quantity`}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gold-200/25 text-gold-200 transition-all hover:bg-gold-200 hover:text-choco-600 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gold-200 active:scale-90"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span
              className={`min-w-[2ch] text-center font-display text-lg font-semibold ${
                quantity > 0 ? 'text-cream-100' : 'text-cream-200/40'
              }`}
            >
              {quantity}
            </span>
            <button
              onClick={onIncrement}
              aria-label={`Increase ${product.name} quantity`}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-200 text-choco-600 transition-all hover:bg-gold-100 active:scale-90"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {quantity > 0 && (
          <div className="mt-3 flex items-center gap-2 font-label text-xs font-semibold uppercase tracking-wider text-gold-300">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-300" />
            Added to order
          </div>
        )}
      </div>
    </div>
  );
}
