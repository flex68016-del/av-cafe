import { Button } from './Button';

export function Footer() {
  return (
    <footer className="bg-orange-500 text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl font-heading font-bold mb-4">
          UNE ENVIE DE BUBBLE TEA ?
        </h2>
        <Button variant="secondary" href="#commander" className="bg-black text-white border-black hover:bg-gray-900">
          Commander en ligne
        </Button>
        <p className="mt-6 text-sm opacity-80">
          Avenue Café - Avenou, Lomé - Maquette de démonstration, contenus à valider avec le gérant
        </p>
      </div>
    </footer>
  );
}
