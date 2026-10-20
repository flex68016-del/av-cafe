import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0B0B0B] border-t border-gray-800 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-heading font-bold text-orange-500 mb-4">
              Avenue Café
            </h3>
            <p className="text-gray-400 text-sm">
              Votre café de rue à Lomé, Togo. Qualité, ambiance et saveurs authentiques.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-lg font-heading font-bold text-white mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/menu" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/cocktails" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">
                  Cocktails
                </Link>
              </li>
              <li>
                <Link href="/commande" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">
                  Commander
                </Link>
              </li>
            </ul>
          </div>

          {/* Horaires */}
          <div>
            <h4 className="text-lg font-heading font-bold text-white mb-4">Horaires</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Lun - Ven : 8h - 22h</li>
              <li>Sam : 9h - 23h</li>
              <li>Dim : 10h - 20h</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-heading font-bold text-white mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Lomé, Togo</li>
              <li>+228 XX XX XX XX</li>
              <li>contact@avenuecafe.tg</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} Avenue Café. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            <Link href="/mentions-legales" className="text-gray-500 hover:text-orange-500 transition-colors text-sm">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="text-gray-500 hover:text-orange-500 transition-colors text-sm">
              Confidentialité
            </Link>
            <Link href="/cgv" className="text-gray-500 hover:text-orange-500 transition-colors text-sm">
              CGV
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
