/* eslint-disable react/no-unescaped-entities */
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-center mb-8 text-orange-500">
          Mentions Légales
        </h1>
        
        <div className="max-w-3xl mx-auto space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Éditeur du site</h2>
            <p className="text-gray-300">
              Avenue Café<br />
              Avenou, Lomé, Togo<br />
              Téléphone : +228 XX XX XX XX<br />
              Email : contact@avenuecafe.tg
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Hébergement</h2>
            <p className="text-gray-300">
              Ce site est hébergé par Vercel Inc.<br />
              340 S Lemon Ave #4133<br />
              Walnut, CA 91748, USA
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Propriété intellectuelle</h2>
            <p className="text-gray-300">
              L&apos;ensemble du contenu de ce site (textes, images, vidéos, logos, etc.) est protégé par le droit d&apos;auteur. 
              Toute reproduction, même partielle, est interdite sans autorisation préalable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Protection des données personnelles</h2>
            <p className="text-gray-300">
              Les données personnelles collectées sur ce site sont traitées conformément à notre politique de confidentialité.
              Pour toute question concernant vos données, contactez-nous à l'adresse : contact@avenuecafe.tg
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Cookies</h2>
            <p className="text-gray-300">
              Ce site utilise des cookies pour améliorer votre expérience de navigation. 
              Vous pouvez configurer votre navigateur pour refuser les cookies.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
