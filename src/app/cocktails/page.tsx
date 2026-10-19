import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MotionSection } from '@/components/MotionSection';

const cocktails = [
  {
    name: "MAI-TAI",
    type: "Cocktail",
    price: "3500 F",
    ingredients: "Rhum blanc, rhum ambré, Cointreau, sirop de passion"
  },
  {
    name: "BLUE HAWAÏEN",
    type: "Cocktail",
    price: "3500 F",
    ingredients: "Jus d'ananas, lait de coco, rhum blanc, bleu de curaçao"
  },
  {
    name: "BORA-BORA",
    type: "Mocktail",
    price: "3000 F",
    ingredients: "Jus d'orange, ananas, citron, passion, grenadine"
  },
  {
    name: "TROPICAL",
    type: "Mocktail",
    price: "3000 F",
    ingredients: "Jus d'orange, jus de mangue, sirop de menthe"
  }
];

export default function CocktailsPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-center mb-12">
          COCKTAILS & MOCKTAILS
        </h1>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {cocktails.map((cocktail, index) => (
            <MotionSection key={index} delay={index * 0.1}>
              <div className="bg-gray-900 rounded-lg p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-2xl font-heading font-bold">{cocktail.name}</h2>
                  <span className="text-orange-500 font-bold">{cocktail.price}</span>
                </div>
                <p className="text-sm text-gray-400 mb-2">{cocktail.type}</p>
                <p className="text-gray-300">{cocktail.ingredients}</p>
              </div>
            </MotionSection>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
