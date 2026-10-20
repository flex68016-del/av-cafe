import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, DM_Sans } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from '@/components/SmoothScroll';
import { CartProvider } from '@/contexts/CartContext';
import Footer from '@/components/Footer';
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration';

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const viewport: Viewport = {
  themeColor: "#0B0B0B",
};

export const metadata: Metadata = {
  metadataBase: new URL('https://av-cafe-sage.vercel.app'),
  title: "Avenue Café – Bubble tea, brunch et plats gourmands à Lomé",
  description: "Découvrez Avenue Café à Avenou, Lomé : Bubble Tea authentique, brunch, plats gourmands et cocktails. Commandez en ligne ou venez déguster sur place.",
  keywords: "bubble tea, brunch, cocktails, Lomé, Togo, café, avenue café",
  openGraph: {
    title: "Avenue Café – Bubble tea, brunch et plats gourmands à Lomé",
    description: "Découvrez Avenue Café à Avenou, Lomé : Bubble Tea authentique, brunch, plats gourmands et cocktails.",
    type: "website",
    locale: "fr_FR",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Avenue Café – Bubble tea, brunch et plats gourmands à Lomé",
      },
    ],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Avenue Café",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${barlowCondensed.variable} ${dmSans.variable} h-full antialiased`}
    >
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Restaurant",
              "name": "Avenue Café",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Avenou",
                "addressLocality": "Lomé",
                "addressCountry": "TG"
              },
              "telephone": "+228 72 22 92 06",
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Tuesday", "Wednesday", "Thursday"],
                  "opens": "10:00",
                  "closes": "22:00"
                },
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Friday", "Saturday"],
                  "opens": "10:00",
                  "closes": "23:00"
                },
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": "Sunday",
                  "opens": "10:00",
                  "closes": "21:00"
                }
              ]
            })
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <ServiceWorkerRegistration />
          <SmoothScroll>
            {children}
          </SmoothScroll>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
