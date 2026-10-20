'use client';

import Link from 'next/link';
import { BounceBadge } from './motion/BounceBadge';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';
import { Cart } from './Cart';
import Logo from './Logo';
import LogoSteam from './LogoSteam';
import { PWAInstallButton } from './PWAInstallButton';

export function Header() {
  const { items } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-[#0B0B0B] border-b border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between relative">
            <Link href="/" className="relative">
              <div className="relative">
                <Logo variant="complet" color="blanc" size={150} className="h-12 w-auto" />
                <LogoSteam className="-top-4 left-1/2 -translate-x-1/2 w-24 h-24" />
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-white hover:text-orange-500 transition-colors">
                Accueil
              </Link>
              <Link href="/menu" className="text-white hover:text-orange-500 transition-colors">
                Menu
              </Link>
              <Link href="/cocktails" className="text-white hover:text-orange-500 transition-colors">
                Cocktails
              </Link>
              <Link href="/#infos" className="text-white hover:text-orange-500 transition-colors">
                Infos
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <PWAInstallButton />

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 hover:bg-gray-800 rounded-lg transition-colors min-h-[44px] min-w-[44px]"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <BounceBadge count={items.length} />
              </button>

              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-white p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-900 border-b border-gray-800">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link href="/" className="text-white hover:text-orange-500 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
              Accueil
            </Link>
            <Link href="/menu" className="text-white hover:text-orange-500 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
              Menu
            </Link>
            <Link href="/cocktails" className="text-white hover:text-orange-500 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
              Cocktails
            </Link>
            <Link href="/#infos" className="text-white hover:text-orange-500 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
              Infos
            </Link>
          </nav>
        </div>
      )}

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
