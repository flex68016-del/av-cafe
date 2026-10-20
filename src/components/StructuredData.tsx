export function StructuredData() {
  const structuredData = {
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
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
