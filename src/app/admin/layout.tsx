/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr && pathname !== '/admin') {
      router.push('/admin');
      return;
    }
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, [router, pathname]);

  function handleLogout() {
    localStorage.removeItem('user');
    router.push('/admin');
  }

  const navLinks = [
    { href: '/admin/orders', label: 'Commandes', showFor: ['manager', 'cashier'] },
    { href: '/admin/daily-sales', label: 'Ventes du jour', showFor: ['manager'] },
    { href: '/admin/menu', label: 'Menu', showFor: ['manager'] },
  ];

  const visibleLinks = user ? navLinks.filter(link => link.showFor.includes(user.role)) : [];

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      {/* Admin Navbar - Only show if not on login page */}
      {pathname !== '/admin' && (
        <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/admin/orders" className="text-2xl font-heading font-bold text-orange-500">
                Admin
              </Link>

              {/* Navigation Links */}
              <div className="flex items-center gap-6">
                {visibleLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors min-h-[44px] flex items-center ${
                      pathname === link.href
                        ? 'text-orange-500'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm min-h-[44px]"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Page Content */}
      <main>{children}</main>
    </div>
  );
}
