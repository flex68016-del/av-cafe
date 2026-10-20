import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, DM_Sans } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from '@/components/SmoothScroll';
import { CartProvider } from '@/contexts/CartContext';

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
  themeColor: "#F57C1F",
};

export const metadata: Metadata = {
  title: "Avenue Café - Bubble Tea, Brunch & Plats Gourmands | Avenou, Lomé",
  description: "Découvrez Avenue Café à Avenou, Lomé : Bubble Tea authentique, brunch, plats gourmands et cocktails. Commandez en ligne ou venez déguster sur place.",
  keywords: "bubble tea, brunch, cocktails, Lomé, Togo, café, avenue café",
  openGraph: {
    title: "Avenue Café - Bubble Tea, Brunch & Plats Gourmands",
    description: "Découvrez Avenue Café à Avenou, Lomé : Bubble Tea authentique, brunch, plats gourmands et cocktails.",
    type: "website",
    locale: "fr_FR",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AvCafé",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${barlowCondensed.variable} ${dmSans.variable} h-full antialiased`}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script
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
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </CartProvider>
      </body>
    </html>
  );
}
