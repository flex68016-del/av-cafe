/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr && pathname !== '/admin') {
      router.push('/admin');
      return;
    }
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
      
      // Rediriger le manager vers daily-sales s'il essaie d'accéder à orders
      if (userData.role === 'manager' && pathname === '/admin/orders') {
        router.push('/admin/daily-sales');
      }
    }
  }, [router, pathname]);

  function handleLogout() {
    localStorage.removeItem('user');
    router.push('/admin');
  }

  const navLinks = [
    { href: '/admin/orders', label: 'Commandes', showFor: ['cashier'] },
    { href: '/pos', label: 'Nouvelle vente', showFor: ['cashier'] },
    { href: '/admin/daily-sales', label: 'Ventes du jour', showFor: ['manager'] },
    { href: '/admin/menu', label: 'Menu et prix', showFor: ['manager'] },
    { href: '/admin/settings', label: 'Réglages', showFor: ['manager'] },
  ];

  const visibleLinks = user ? navLinks.filter(link => link.showFor.includes(user.role)) : [];

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white flex">
      {/* Admin Sidebar - Only show if not on login page */}
      {pathname !== '/admin' && (
        <>
          {/* Mobile menu button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden fixed top-4 left-4 z-50 bg-orange-500 p-2 rounded-lg min-h-[44px] min-w-[44px]"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isSidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Sidebar */}
          <aside className={`fixed left-0 top-0 bottom-0 z-40 flex flex-col transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 w-[230px] bg-bg-sidebar border-r border-border`}>
            {/* Logo */}
            <div className="p-6 border-b border-border">
              <button
                onClick={() => {
                  router.push(user?.role === 'manager' ? '/admin/daily-sales' : '/admin/orders');
                  setIsSidebarOpen(false);
                }}
                className="h-12"
              >
                <div className="text-heading font-bold text-[28px] uppercase leading-none">
                  AVENUE
                  <span className="text-orange">CAFÉ</span>
                </div>
                <div className="text-[12px] text-text-tertiary mt-1">Administration</div>
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 p-4 space-y-[6px]">
              {visibleLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => {
                    router.push(link.href);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full text-left px-[14px] py-3 rounded-[10px] text-[16px] font-medium transition-colors min-h-[44px] flex items-center ${
                    pathname === link.href
                      ? 'bg-orange text-orange-text font-bold'
                      : 'text-text-sidebar-inactive hover:bg-bg-card'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-border">
              <button
                onClick={() => {
                  handleLogout();
                  setIsSidebarOpen(false);
                }}
                className="w-full bg-bg-card hover:bg-bg-subcard px-4 py-3 rounded-[10px] text-sm min-h-[44px] text-left"
              >
                Déconnexion
              </button>
            </div>
          </aside>

          {/* Overlay for mobile */}
          {isSidebarOpen && (
            <div
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-30"
            />
          )}
        </>
      )}

      {/* Page Content */}
      <main className={`flex-1 ${pathname !== '/admin' ? 'lg:ml-64' : ''} ${pathname !== '/admin' ? 'pt-16 lg:pt-0' : ''}`}>{children}</main>
    </div>
  );
}
