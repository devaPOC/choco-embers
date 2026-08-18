'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Utensils, Package, LogOut, Users, TrendingUp, Menu, X } from 'lucide-react';
import { logout } from '../actions/auth';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If on login page, don't show sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Menu', href: '/admin/menu', icon: Utensils },
    { name: 'Inventory', href: '/admin/inventory', icon: Package },
    { name: 'Team', href: '/admin/team', icon: Users },
    { name: 'Analytics', href: '/admin/analytics', icon: TrendingUp },
  ];

  const navContent = (
    <>
      <div className="mb-12 px-2">
        <h2 className="font-display text-2xl font-semibold text-cream-100">Admin Portal</h2>
        <p className="mt-1 font-label text-xs uppercase tracking-wider text-gold-200">Choco Ember</p>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 font-label text-sm font-semibold uppercase tracking-wider transition-colors ${isActive
                  ? 'bg-gold-200 text-choco-600'
                  : 'text-cream-200/70 hover:bg-choco-400 hover:text-cream-100'
                }`}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-8 flex w-full items-center gap-3 rounded-xl px-4 py-3 font-label text-sm font-semibold uppercase tracking-wider text-red-400 transition-colors hover:bg-red-500/10"
      >
        <LogOut className="h-5 w-5" />
        Logout
      </button>
    </>
  );

  return (
    <div className="flex min-h-screen bg-choco-500">
      {/* Desktop sidebar — hidden on mobile */}
      <div className="hidden md:flex w-64 flex-shrink-0 flex-col border-r border-gold-200/10 bg-choco-600 px-4 py-8">
        {navContent}
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-choco-600/80 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Slide-in panel */}
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-choco-600 px-4 py-8 shadow-warm-xl animate-[slideInLeft_0.25s_ease-out]">
            {/* Close button */}
            <button
              onClick={() => setSidebarOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-gold-200/20 text-gold-200 transition-colors hover:bg-gold-200 hover:text-choco-600"
            >
              <X className="h-4 w-4" />
            </button>
            {navContent}
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile top bar — hidden on desktop */}
        <header className="flex items-center justify-between border-b border-gold-200/10 bg-choco-600 px-4 py-3 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-gold-200 transition-colors hover:bg-choco-400"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <img
              src="/images/logo.png"
              alt="Choco Ember logo"
              className="h-8 w-8 rounded-full object-cover ring-1 ring-gold-200/30"
            />
            <span className="font-display text-base font-semibold text-cream-100">Admin</span>
          </div>
          {/* Spacer to center the logo */}
          <div className="w-10" />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>

      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
