import { Helmet } from 'react-helmet-async';

/**
 * StructuredData Component
 * Adiciona JSON-LD para rich snippets do Google
 */
export function StructuredData() {
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Bakery',
    name: 'VZ Dolci',
    description: 'Doceria artesanal de luxo especializada em doces premium',
    url: 'https://vz-dolci.vercel.app',
    logo: 'https://vz-dolci.vercel.app/logo.png',
    image: 'https://vz-dolci.vercel.app/og-image.jpg',
    priceRange: '$$$$',
    servesCuisine: 'Confeitaria Brasileira',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'BR',
      addressLocality: 'Brasil'
    },
    sameAs: []
  };

  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'VZ Dolci',
    url: 'https://vz-dolci.vercel.app',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://vz-dolci.vercel.app/produtos?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organizationData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteData)}
      </script>
    </Helmet>
  );
}
