import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MenuContent } from './MenuContent';

export const dynamic = 'force-dynamic';

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      <Header />
      <MenuContent />
      <Footer />
    </div>
  );
}
