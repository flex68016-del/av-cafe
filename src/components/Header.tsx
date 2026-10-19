import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-[#0B0B0B] border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-heading font-bold text-orange-500">
            AVENUE CAFÉ
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

          <button className="md:hidden text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
