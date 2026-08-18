'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Utensils, Package, LogOut, Users, TrendingUp } from 'lucide-react';
import { logout } from '../actions/auth';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

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

  return (
    <div className="flex min-h-screen bg-choco-500">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 border-r border-gold-200/10 bg-choco-600 px-4 py-8 flex flex-col">
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
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}
