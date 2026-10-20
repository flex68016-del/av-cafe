'use client';

import { Header } from '@/components/Header';
import { Reveal } from '@/components/motion/Reveal';
import { useCart } from '@/contexts/CartContext';

const cocktails = [
  {
    id: 'cocktail-1',
    name: "MAI-TAI",
    type: "Cocktail",
    price: 3500,
    ingredients: "Rhum blanc, rhum ambré, Cointreau, sirop de passion"
  },
  {
    id: 'cocktail-2',
    name: "BLUE HAWAÏEN",
    type: "Cocktail",
    price: 3500,
    ingredients: "Jus d'ananas, lait de coco, rhum blanc, bleu de curaçao"
  },
  {
    id: 'cocktail-3',
    name: "BORA-BORA",
    type: "Mocktail",
    price: 3000,
    ingredients: "Jus d'orange, ananas, citron, passion, grenadine"
  },
  {
    id: 'cocktail-4',
    name: "TROPICAL",
    type: "Mocktail",
    price: 3000,
    ingredients: "Jus d'orange, jus de mangue, sirop de menthe"
  }
];

export default function CocktailsPage() {
  const { addToCart } = useCart();

  function handleAddToCart(cocktail: typeof cocktails[0]) {
    addToCart({
      id: cocktail.id,
      name: cocktail.name,
      price: cocktail.price,
    });
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <Reveal>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-center mb-12">
            COCKTAILS & MOCKTAILS
          </h1>
        </Reveal>

        <Reveal>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {cocktails.map((cocktail, index) => (
              <Reveal key={cocktail.id} delay={index * 0.1}>
                <div className="bg-gray-900 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-2xl font-heading font-bold">{cocktail.name}</h2>
                    <span className="text-orange-500 font-bold">{cocktail.price} F</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{cocktail.type}</p>
                  <p className="text-gray-300 mb-4">{cocktail.ingredients}</p>
                  <button
                    onClick={() => handleAddToCart(cocktail)}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors min-h-[44px]"
                  >
                    Ajouter
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </main>
    </div>
  );
}
