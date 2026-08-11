import { MapPin, MessageCircle, Heart } from 'lucide-react';
import { BRAND } from '../data/products';

type Props = {
  onNavigateHome: () => void;
};

export default function Footer({ onNavigateHome }: Props) {
  return (
    <footer className="relative overflow-hidden bg-choco-600 text-cream-100">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Brand */}
          <div>
            <button onClick={onNavigateHome} className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="Choco Ember logo"
                className="h-12 w-12 rounded-full object-cover ring-1 ring-gold-200/30"
              />
              <span className="font-display text-xl font-semibold text-cream-100">Choco Ember</span>
            </button>
            <p className="mt-4 max-w-xs font-body text-sm leading-relaxed text-cream-200/60">
              {BRAND.tagline}
            </p>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-4 font-label text-xs font-semibold uppercase tracking-[0.2em] text-gold-200">
              Get in touch
            </p>
            <ul className="space-y-3 font-body text-sm text-cream-200/70">
              <li className="flex items-start gap-3">
                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-gold-200" />
                <span>
                  WhatsApp{' '}
                  <span className="text-cream-100">+91 8106945511</span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-200" />
                <span>{BRAND.location}</span>
              </li>
            </ul>
          </div>

          {/* Tagline */}
          <div>
            <p className="mb-4 font-label text-xs font-semibold uppercase tracking-[0.2em] text-gold-200">
              Our promise
            </p>
            <p className="font-body text-sm leading-relaxed text-cream-200/60">
              Every piece is handmade in small batches, with the finest cocoa and real fruit - no
              shortcuts, no preservatives. Just honest chocolate, made to be shared.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-cream-100/10 pt-8 sm:flex-row">
          <p className="font-label text-xs uppercase tracking-wider text-cream-200/40">
            © {new Date().getFullYear()} Choco Ember · {BRAND.founder}
          </p>
          <p className="flex items-center gap-2 font-label text-xs uppercase tracking-wider text-cream-200/40">
            Made with <Heart className="h-3 w-3 fill-gold-200 text-gold-200" /> in Visakhapatnam
          </p>
        </div>
      </div>
    </footer>
  );
}
