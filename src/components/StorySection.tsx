import { BRAND } from '../data/products';

type Props = {
  onNavigateMenu: () => void;
};

export default function StorySection({ onNavigateMenu }: Props) {
  return (
    <section id="story" className="relative bg-choco-400 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          {/* Image side */}
          <div className="relative order-2 md:order-1">
            <div className="relative overflow-hidden rounded-4xl shadow-warm-lg ring-1 ring-gold-200/15">
              <img
                src="https://images.pexels.com/photos/4110004/pexels-photo-4110004.jpeg?auto=compress&cs=tinysrgb&w=900"
                alt="Artisan hand-tempering chocolate"
                className="aspect-[4/5] w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-choco-500/50 to-transparent" />
            </div>
            <div className="absolute -bottom-5 -right-5 -z-10 h-40 w-40 rounded-3xl border-2 border-gold-200/30" />
            <div className="absolute -top-5 -left-5 -z-10 h-24 w-24 rounded-full bg-gold-200/10" />
          </div>

          {/* Text side */}
          <div className="order-1 md:order-2">
            <p className="section-label mb-4">Our Story</p>
            <h2 className="mb-6 font-display text-3xl font-semibold leading-tight text-cream-100 sm:text-4xl">
              Crafted by hand, <br />
              <span className="italic text-gold-200">made with intention.</span>
            </h2>
            <div className="space-y-5 font-body text-base leading-relaxed text-cream-200/80 sm:text-lg">
              <p>
                Choco Ember began in a small Visakhapatnam kitchen, where {BRAND.founder} started
                tempering chocolate by hand — one small batch at a time.
              </p>
              <p>
                We use the finest cocoa, fold in real fruit purées, and toast our own coconut. No
                shortcuts, no preservatives — just honest, handmade chocolate made to be shared.
              </p>
              <p className="font-body italic text-gold-200/80">
                Every bar and truffle carries the warmth of a home kitchen and the care of a
                craftsperson.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {['Single-origin cocoa', 'Hand-tempered', 'Real fruit purées', 'No preservatives'].map(
                (item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-2 rounded-full border border-gold-200/20 bg-choco-300/50 px-4 py-2 font-label text-xs font-semibold uppercase tracking-wider text-gold-200"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-gold-200" />
                    {item}
                  </span>
                )
              )}
            </div>

            <button onClick={onNavigateMenu} className="btn-primary mt-10">
              See the Menu
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
