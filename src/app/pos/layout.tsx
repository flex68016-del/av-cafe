import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration';

export default function POSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ServiceWorkerRegistration />
      {children}
    </>
  );
}
