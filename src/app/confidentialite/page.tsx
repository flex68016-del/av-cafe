/* eslint-disable react/no-unescaped-entities */
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-center mb-8 text-orange-500">
          Politique de Confidentialité
        </h1>
        
        <div className="max-w-3xl mx-auto space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Collecte des données</h2>
            <p className="text-gray-300">
              Nous collectons les données suivantes lorsque vous passez commande :
            </p>
            <ul className="list-disc list-inside text-gray-300 ml-4">
              <li>Nom et prénom</li>
              <li>Numéro de téléphone</li>
              <li>Adresse de livraison (si applicable)</li>
              <li>Contenu de votre commande</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Utilisation des données</h2>
            <p className="text-gray-300">
              Vos données sont utilisées pour :
            </p>
            <ul className="list-disc list-inside text-gray-300 ml-4">
              <li>Traiter vos commandes</li>
              <li>Vous contacter en cas de problème avec votre commande</li>
              <li>Améliorer nos services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Conservation des données</h2>
            <p className="text-gray-300">
              Vos données de commande sont conservées pendant une durée maximale de 2 ans à compter de votre dernière commande.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Vos droits</h2>
            <p className="text-gray-300">
              Conformément à la loi togolaise sur la protection des données personnelles, vous disposez des droits suivants :
            </p>
            <ul className="list-disc list-inside text-gray-300 ml-4">
              <li>Droit d&apos;accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit à l&apos;effacement</li>
              <li>Droit d&apos;opposition</li>
            </ul>
            <p className="text-gray-300 mt-4">
              Pour exercer ces droits, contactez-nous à : contact@avenuecafe.tg
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Sécurité</h2>
            <p className="text-gray-300">
              Nous mettons en œuvre toutes les mesures techniques et organisationnelles appropriées pour protéger vos données 
              contre tout accès non autorisé, perte, destruction ou dommage.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
