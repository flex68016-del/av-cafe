import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/Button';
import { MotionSection } from '@/components/MotionSection';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      <Header />
      
      {/* Hero Section */}
      <MotionSection>
        <section className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4">
                BUBBLE TEA, <br />
                <span className="text-orange-500">BRUNCH & PLATS GOURMANDS</span>
              </h1>
              <p className="text-gray-300 mb-8 text-lg">
                Découvrez un lieu unique au cœur de Lomé, où bubble tea authentique, brunch savoureux et cocktails raffinés se rencontrent.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button href="/menu">Voir le menu</Button>
                <Button variant="secondary" href="tel:+22872229206">
                  Appeler +228 72 22 92 06
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gray-800 flex items-center justify-center">
                <span className="text-gray-600">[PHOTO bubble tea]</span>
              </div>
            </div>
          </div>
        </section>
      </MotionSection>

      {/* Horaires */}
      <section className="bg-gray-900 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm md:text-base">
            <span>Mardi - Jeudi: 10h - 22h</span>
            <span>Vendredi - Samedi: 10h - 23h</span>
            <span>Dimanche: 10h - 21h</span>
          </div>
        </div>
      </section>

      {/* Concept Section */}
      <MotionSection delay={0.1}>
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-4">
            LE CONCEPT
          </h2>
          <p className="text-xl text-orange-500 text-center mb-12">
            UN SEUL LIEU, TROIS UNIVERS
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-900 p-6 rounded-lg">
              <div className="text-4xl font-heading font-bold text-orange-500 mb-4">01</div>
              <h3 className="text-xl font-bold mb-2">Bubble Tea</h3>
              <p className="text-gray-400">Des recettes authentiques avec perles de tapioca fraîches.</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg">
              <div className="text-4xl font-heading font-bold text-orange-500 mb-4">02</div>
              <h3 className="text-xl font-bold mb-2">Brunch & Plats</h3>
              <p className="text-gray-400">Une cuisine gourmande pour tous les moments de la journée.</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg">
              <div className="text-4xl font-heading font-bold text-orange-500 mb-4">03</div>
              <h3 className="text-xl font-bold mb-2">Cocktails</h3>
              <p className="text-gray-400">Des créations originales pour vos soirées.</p>
            </div>
          </div>
        </section>
      </MotionSection>

      {/* Créations Section */}
      <MotionSection delay={0.2}>
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-12">
            NOS CRÉATIONS
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "L'Avenue Brown Sugar", price: "1700 F" },
              { name: "Croque Avenue Madame", price: "3000 F" },
              { name: "Pancake caramel", price: "2500 F" },
              { name: "Mai-Tai", price: "3500 F" },
            ].map((item, index) => (
              <div key={index} className="bg-gray-900 rounded-lg overflow-hidden">
                <div className="aspect-square bg-gray-800 flex items-center justify-center">
                  <span className="text-gray-600 text-sm">[PHOTO]</span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold mb-1">{item.name}</h3>
                  <p className="text-orange-500">{item.price}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button href="/menu">Voir tout le menu</Button>
          </div>
        </section>
      </MotionSection>

      {/* Commander Section */}
      <MotionSection delay={0.3}>
        <section id="commander" className="container mx-auto px-4 py-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-4">
            SIMPLE ET RAPIDE, DIRECTEMENT EN LIGNE
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Choisissez</h3>
              <p className="text-gray-400">Ajoutez vos plats et boissons à votre panier.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Validez</h3>
              <p className="text-gray-400">Votre commande est transmise tout de suite à l&apos;équipe.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Retirez ou venez</h3>
              <p className="text-gray-400">Retrait sur place. Livraison : [À CONFIRMER].</p>
            </div>
          </div>
          <div className="text-center mt-12">
            <Button>Commander en ligne</Button>
          </div>
        </section>
      </MotionSection>

      {/* Ambiance Section */}
      <MotionSection delay={0.4}>
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-12">
            UN LIEU À VIVRE
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
              <span className="text-gray-600">[PHOTO intérieur, lumière chaude]</span>
            </div>
            <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
              <span className="text-gray-600">[PHOTO comptoir]</span>
            </div>
            <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
              <span className="text-gray-600">[PHOTO cocktails]</span>
            </div>
          </div>
        </section>
      </MotionSection>

      {/* Avis Section */}
      <MotionSection delay={0.5}>
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-12">
            AVIS DE NOS CLIENTS
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((index) => (
              <div key={index} className="bg-gray-900 p-6 rounded-lg">
                <div className="text-orange-500 mb-4">[ÉTOILES]</div>
                <p className="text-gray-300 mb-4">
                  [AVIS CLIENT {index}: à récupérer sur Google Maps ou en commentaire]
                </p>
                <p className="font-bold">[PRÉNOM]</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center max-w-2xl mx-auto">
              <span className="text-gray-600">[PHOTO équipe]</span>
            </div>
          </div>
        </section>
      </MotionSection>

      {/* Infos Section */}
      <MotionSection delay={0.6}>
        <section id="infos" className="container mx-auto px-4 py-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-12">
            NOUS TROUVER
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-orange-500 mb-2">Adresse</h3>
                  <p className="text-gray-300">Avenou, Lomé, Togo</p>
                </div>
                <div>
                  <h3 className="font-bold text-orange-500 mb-2">Téléphone</h3>
                  <p className="text-gray-300">+228 72 22 92 06</p>
                </div>
                <div>
                  <h3 className="font-bold text-orange-500 mb-2">Horaires</h3>
                  <p className="text-gray-300">
                    Mardi - Jeudi: 10h - 22h<br />
                    Vendredi - Samedi: 10h - 23h<br />
                    Dimanche: 10h - 21h
                  </p>
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <Button variant="secondary">Instagram</Button>
                <Button variant="secondary">TikTok</Button>
              </div>
            </div>
            <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
              <span className="text-gray-600">[CARTE GOOGLE MAPS]</span>
            </div>
          </div>
        </section>
      </MotionSection>

      <Footer />
    </div>
  );
}
