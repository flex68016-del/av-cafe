/* eslint-disable react/no-unescaped-entities */
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';

export default function CGVPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-center mb-8 text-orange-500">
          Conditions Générales de Vente
        </h1>
        
        <div className="max-w-3xl mx-auto space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Objet</h2>
            <p className="text-gray-300">
              Les présentes Conditions Générales de Vente (CGV) régissent la vente de produits alimentaires et boissons 
              proposés par Avenue Café sur son site internet et en point de vente.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Produits</h2>
            <p className="text-gray-300">
              Les produits proposés sont ceux figurant sur notre menu au moment de la commande. 
              Nous nous réservons le droit de modifier les produits et leurs prix à tout moment.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Commande en ligne</h2>
            <p className="text-gray-300">
              Le client peut passer commande via notre site internet. La commande est considérée comme acceptée 
              après confirmation de notre part par téléphone ou message.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Prix</h2>
            <p className="text-gray-300">
              Les prix sont indiqués en Francs CFA (F CFA) et sont toutes taxes comprises. 
              Nous nous réservons le droit de modifier nos prix à tout moment.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Paiement</h2>
            <p className="text-gray-300">
              Le paiement s'effectue :
            </p>
            <ul className="list-disc list-inside text-gray-300 ml-4">
              <li>En espèces à la livraison ou au point de vente</li>
              <li>Par Mobile Money (Flooz, Moov Money)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Livraison</h2>
            <p className="text-gray-300">
              La livraison est organisée selon nos disponibilités. Les délais de livraison sont donnés à titre indicatif 
              et ne constituent pas un engagement ferme.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Rétractation</h2>
            <p className="text-gray-300">
              Conformément à la réglementation en vigueur, le client dispose d&apos;un délai de rétractation de 24 heures 
              à compter de la commande pour annuler sa commande sans frais.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Réclamation</h2>
            <p className="text-gray-300">
              Toute réclamation concernant un produit doit être formulée dès la réception de la commande 
              par téléphone au +228 XX XX XX XX ou par email à contact@avenuecafe.tg
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Responsabilité</h2>
            <p className="text-gray-300">
              Avenue Café ne peut être tenue responsable des dommages résultant de l'utilisation de produits 
              alimentaires, notamment en cas d'allergies ou d'intolérances alimentaires.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Loi applicable</h2>
            <p className="text-gray-300">
              Les présentes CGV sont soumises à la loi togolaise. Tout litige sera soumis aux tribunaux compétents de Lomé.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
