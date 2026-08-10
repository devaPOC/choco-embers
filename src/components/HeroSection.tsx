import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

type Props = {
  onNavigateMenu: () => void;
};

export default function HeroSection({ onNavigateMenu }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [parallax, setParallax] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 40);
        setParallax(y * 0.35);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={heroRef} className="relative min-h-screen overflow-hidden bg-choco-500">
      {/* Background image with parallax + dual overlay */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{ transform: `translateY(${parallax}px) scale(1.08)` }}
      >
        <img
          src="https://images.pexels.com/photos/65882/chocolate-dark-coffee-confiserie-65882.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt="Handmade chocolates on a wooden surface"
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-choco-600/85 via-choco-500/55 to-choco-600/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-choco-600/60 via-transparent to-choco-600/40" />
        {/* Animated sheen */}
        <div className="absolute inset-0 opacity-30 mix-blend-soft-light">
          <div className="absolute -inset-[60%] animate-[spin_40s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0%,rgba(233,193,118,0.15)_12%,transparent_25%,transparent_50%,rgba(233,193,118,0.1)_62%,transparent_75%)]" />
        </div>
      </div>

      {/* Floating ambient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[8%] top-[22%] h-32 w-32 rounded-full bg-gold-200/8 blur-3xl animate-[float_8s_ease-in-out_infinite]" />
        <div className="absolute right-[12%] top-[35%] h-40 w-40 rounded-full bg-gold-300/6 blur-3xl animate-[float_11s_ease-in-out_infinite_1s]" />
        <div className="absolute left-[18%] bottom-[28%] h-24 w-24 rounded-full bg-cream-100/5 blur-2xl animate-[float_7s_ease-in-out_infinite_2s]" />
        <div className="absolute right-[22%] bottom-[20%] h-28 w-28 rounded-full bg-gold-200/6 blur-3xl animate-[float_9s_ease-in-out_infinite_0.5s]" />
      </div>

      {/* Nav */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'bg-choco-400/95 backdrop-blur-md shadow-warm-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3"
          >
            <img
              src="/images/choco_ember_premium_logo_redesign.png"
              alt="Choco Ember logo"
              className={`h-11 w-11 rounded-full object-cover ring-1 transition-all duration-500 ${
                scrolled ? 'ring-gold-200/30' : 'ring-cream-100/40'
              }`}
            />
            <span
              className={`font-display text-xl font-semibold tracking-wide transition-colors duration-500 ${
                scrolled ? 'text-gold-200' : 'text-cream-100'
              }`}
            >
              Choco Ember
            </span>
          </button>
          <button
            onClick={onNavigateMenu}
            className={`font-label text-xs font-semibold uppercase tracking-[0.2em] transition-colors duration-500 ${
              scrolled
                ? 'text-gold-200 hover:text-gold-100'
                : 'text-cream-100 hover:text-gold-200'
            }`}
          >
            Menu
          </button>
        </div>
      </header>

      {/* Hero content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-5 pt-24 pb-32 text-center sm:px-8">
        {/* Logo with rotating glow ring */}
        <div className={`mb-8 flex justify-center transition-all duration-1000 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
          <div className="relative">
            {/* Rotating conic ring */}
            <div className="absolute -inset-4 animate-[spin_14s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,transparent_0%,rgba(233,193,118,0.35)_25%,transparent_50%,rgba(233,193,118,0.2)_75%,transparent_100%)] opacity-80 blur-[2px]" />
            {/* Static glow */}
            <div className="absolute -inset-6 rounded-full bg-gold-200/15 blur-2xl" />
            {/* Inner ring */}
            <div className="absolute -inset-1.5 rounded-full border border-gold-200/25" />
            <img
              src="/images/choco_ember_premium_logo_redesign.png"
              alt="Choco Ember logo"
              className="relative h-28 w-28 rounded-full object-cover ring-2 ring-gold-200/40 shadow-warm-lg sm:h-32 sm:w-32"
            />
          </div>
        </div>

        {/* Eyebrow */}
        <div
          className={`mb-5 flex items-center gap-2.5 transition-all duration-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: '150ms' }}
        >
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold-200/60" />
          <span className="flex items-center gap-1.5 font-label text-xs font-semibold uppercase tracking-[0.3em] text-gold-200 sm:text-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Handmade in Visakhapatnam
          </span>
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold-200/60" />
        </div>

        {/* Headline with clip reveal */}
        <h1 className="mb-5 overflow-hidden font-display text-5xl font-semibold leading-[1.05] text-cream-100 text-balance sm:text-7xl md:text-8xl">
          <span
            className={`inline-block transition-all duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              mounted ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
            }`}
          >
            Choco Ember
          </span>
        </h1>

        {/* Tagline */}
        <p
          className={`mb-8 max-w-2xl font-body text-xl italic leading-relaxed text-gold-200/90 transition-all duration-700 sm:text-2xl ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ transitionDelay: '500ms' }}
        >
          Where cocoa meets craft.
        </p>

        {/* Description */}
        <p
          className={`mb-10 max-w-2xl font-body text-base leading-relaxed text-cream-100/80 transition-all duration-700 sm:text-lg ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ transitionDelay: '650ms' }}
        >
          At Choco Ember, we bring you a delightful range of handmade chocolates, crafted with
          care, creativity, and the finest cocoa. Every bite offers a rich, smooth, and memorable
          chocolate experience. Treat yourself - perfect for sweet cravings, gifts, and special
          moments.
        </p>

        {/* CTAs */}
        <div
          className={`flex flex-col items-center gap-5 transition-all duration-700 sm:flex-row ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '800ms' }}
        >
          <button
            onClick={onNavigateMenu}
            className="group inline-flex items-center gap-2.5 bg-gold-200 px-8 py-4 font-label text-sm font-semibold uppercase tracking-widest text-choco-600 rounded-full transition-all duration-300 hover:bg-gold-100 hover:shadow-glow-gold active:scale-95"
          >
            Explore the Menu
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <a
            href="#story"
            className="group font-label text-sm font-semibold uppercase tracking-widest text-cream-100 transition-colors hover:text-gold-200"
          >
            <span className="border-b-2 border-transparent pb-1 transition-colors group-hover:border-gold-200/50">
              Our Story
            </span>
          </a>
        </div>

        {/* Stat strip */}
        <div
          className={`mt-16 grid grid-cols-3 gap-4 transition-all duration-1000 sm:gap-12 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '1000ms' }}
        >
          {[
            { value: '9', label: 'Signature Flavours' },
            { value: '100%', label: 'Hand-tempered' },
            { value: '0', label: 'Preservatives' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-2xl font-semibold text-gold-200 sm:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1 font-label text-[10px] uppercase tracking-[0.15em] text-cream-200/50 sm:text-xs">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-opacity duration-1000 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDelay: '1200ms' }}
      >
        <div className="flex flex-col items-center gap-2 text-cream-100/50">
          <span className="font-label text-[10px] uppercase tracking-[0.25em]">Scroll</span>
          <div className="flex h-9 w-5 items-start justify-center rounded-full border border-cream-100/20 p-1">
            <div className="h-1.5 w-1 rounded-full bg-gold-200/70 animate-[scrollDot_1.8s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(20px, -16px); }
          66% { transform: translate(-12px, 12px); }
        }
        @keyframes scrollDot {
          0% { transform: translateY(0); opacity: 1; }
          70% { transform: translateY(14px); opacity: 0; }
          100% { transform: translateY(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
