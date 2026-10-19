import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/Button';
import { Reveal } from '@/components/motion/Reveal';
import { SplitTitle } from '@/components/motion/SplitTitle';
import { BrushTransition } from '@/components/motion/BrushTransition';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import { FloatingBubbles } from '@/components/motion/FloatingBubbles';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      <Header />
      
      {/* Hero Section */}
      <Reveal>
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
            <div className="flex justify-center relative">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gray-800 flex items-center justify-center relative overflow-hidden">
                <span className="text-gray-600">[PHOTO bubble tea]</span>
                <FloatingBubbles />
              </div>
            </div>
          </div>
        </section>
      </Reveal>

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
      <ScrollReveal delay={0.1}>
        <section className="container mx-auto px-4 py-16">
          <BrushTransition className="mb-8" />
          <SplitTitle text="LE CONCEPT" className="text-3xl md:text-4xl font-heading font-bold text-center mb-4" />
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
      </ScrollReveal>

      {/* Créations Section */}
      <ScrollReveal delay={0.2}>
        <section className="container mx-auto px-4 py-16">
          <BrushTransition className="mb-8" />
          <SplitTitle text="NOS CRÉATIONS" className="text-3xl md:text-4xl font-heading font-bold text-center mb-12" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "L'Avenue Brown Sugar", price: "1700 F" },
              { name: "Croque Avenue Madame", price: "3000 F" },
              { name: "Pancake caramel", price: "2500 F" },
              { name: "Mai-Tai", price: "3500 F" },
            ].map((item, index) => (
              <Reveal key={index} delay={0.3 + index * 0.1}>
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <div className="aspect-square bg-gray-800 flex items-center justify-center">
                    <span className="text-gray-600 text-sm">[PHOTO]</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold mb-1">{item.name}</h3>
                    <p className="text-orange-500">{item.price}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button href="/menu">Voir tout le menu</Button>
          </div>
        </section>
      </ScrollReveal>

      {/* Commander Section */}
      <ScrollReveal delay={0.3}>
        <section id="commander" className="container mx-auto px-4 py-16">
          <BrushTransition className="mb-8" />
          <SplitTitle text="SIMPLE ET RAPIDE, DIRECTEMENT EN LIGNE" className="text-3xl md:text-4xl font-heading font-bold text-center mb-4" />
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {[
              { num: 1, title: "Choisissez", desc: "Ajoutez vos plats et boissons à votre panier." },
              { num: 2, title: "Validez", desc: "Votre commande est transmise tout de suite à l&apos;équipe." },
              { num: 3, title: "Retirez ou venez", desc: "Retrait sur place. Livraison : [À CONFIRMER]." },
            ].map((step, index) => (
              <Reveal key={index} delay={0.4 + index * 0.1}>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    {step.num}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-400">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button>Commander en ligne</Button>
          </div>
        </section>
      </ScrollReveal>

      {/* Ambiance Section */}
      <ScrollReveal delay={0.4}>
        <section className="container mx-auto px-4 py-16">
          <BrushTransition className="mb-8" />
          <SplitTitle text="UN LIEU À VIVRE" className="text-3xl md:text-4xl font-heading font-bold text-center mb-12" />
          <div className="grid md:grid-cols-3 gap-4">
            {[
              "[PHOTO intérieur, lumière chaude]",
              "[PHOTO comptoir]",
              "[PHOTO cocktails]"
            ].map((photo, index) => (
              <Reveal key={index} delay={0.5 + index * 0.1}>
                <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                  <span className="text-gray-600">{photo}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Avis Section */}
      <ScrollReveal delay={0.5}>
        <section className="container mx-auto px-4 py-16">
          <BrushTransition className="mb-8" />
          <SplitTitle text="AVIS DE NOS CLIENTS" className="text-3xl md:text-4xl font-heading font-bold text-center mb-12" />
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((index) => (
              <Reveal key={index} delay={0.6 + index * 0.1}>
                <div className="bg-gray-900 p-6 rounded-lg">
                  <div className="text-orange-500 mb-4">[ÉTOILES]</div>
                  <p className="text-gray-300 mb-4">
                    [AVIS CLIENT {index}: à récupérer sur Google Maps ou en commentaire]
                  </p>
                  <p className="font-bold">[PRÉNOM]</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="text-center mt-8">
            <Reveal delay={0.9}>
              <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center max-w-2xl mx-auto">
                <span className="text-gray-600">[PHOTO équipe]</span>
              </div>
            </Reveal>
          </div>
        </section>
      </ScrollReveal>

      {/* Infos Section */}
      <ScrollReveal delay={0.6}>
        <section id="infos" className="container mx-auto px-4 py-16">
          <BrushTransition className="mb-8" />
          <SplitTitle text="NOUS TROUVER" className="text-3xl md:text-4xl font-heading font-bold text-center mb-12" />
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
            <Reveal delay={0.7}>
              <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-gray-600">[CARTE GOOGLE MAPS]</span>
              </div>
            </Reveal>
          </div>
        </section>
      </ScrollReveal>

      <Footer />
    </div>
  );
}
