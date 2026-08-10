"use client";
import { useState, useCallback } from 'react';
import HeroSection from '../components/HeroSection';
import StorySection from '../components/StorySection';
import MenuPage from '../components/MenuPage';
import OrderBar from '../components/OrderBar';
import Footer from '../components/Footer';

type View = 'home' | 'menu';

export default function Storefront({ products }: { products: any[] }) {
  const [view, setView] = useState<View>('home');
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const goMenu = useCallback(() => {
    setView('menu');
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const goHome = useCallback(() => {
    setView('home');
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const increment = useCallback((id: string) => {
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  }, []);

  const decrement = useCallback((id: string) => {
    setQuantities((prev) => {
      const next = (prev[id] ?? 0) - 1;
      const copy = { ...prev };
      if (next <= 0) delete copy[id];
      else copy[id] = next;
      return copy;
    });
  }, []);

  const clearOrder = useCallback(() => setQuantities({}), []);

  return (
    <div className="min-h-screen bg-choco-500">
      {view === 'home' ? (
        <>
          <HeroSection onNavigateMenu={goMenu} />
          <StorySection onNavigateMenu={goMenu} />
        </>
      ) : (
        <MenuPage
          quantities={quantities}
          onIncrement={increment}
          onDecrement={decrement}
          onNavigateHome={goHome}
          products={products}
        />
      )}

      <OrderBar
        quantities={quantities}
        onIncrement={increment}
        onDecrement={decrement}
        onClear={clearOrder}
        products={products}
      />

      <Footer onNavigateHome={goHome} />
    </div>
  );
}
