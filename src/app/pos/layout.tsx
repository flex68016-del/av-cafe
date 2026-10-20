import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration';
import Logo from '@/components/Logo';

export default function POSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ServiceWorkerRegistration />
      <header className="bg-[#0B0B0B] border-b border-gray-800 p-4">
        <Logo variant="marque" color="blanc" size={120} className="h-10 w-auto" />
      </header>
      {children}
    </>
  );
}
