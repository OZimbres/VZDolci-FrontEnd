import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

/**
 * SEO Component
 * Gerencia metadados de cada página
 * @param {string} title - Título da página
 * @param {string} description - Descrição (aparece no Google)
 * @param {string} canonical - URL canônica (evita conteúdo duplicado)
 * @param {string} image - URL da imagem Open Graph
 * @param {string} type - Tipo Open Graph (website, article, product)
 * @param {string} robots - Instruções para indexação
 */
export function SEO({
  title = 'VZ Dolci - Doces Artesanais de Luxo',
  description = 'VZ Dolci - Doces artesanais premium com panna cotta, pão de mel e muito mais. Qualidade excepcional e sabor inesquecível.',
  canonical = 'https://vz-dolci.vercel.app',
  image = 'https://vz-dolci.vercel.app/og-image.jpg',
  type = 'website',
  robots = 'index, follow'
}) {
  const siteName = 'VZ Dolci';
  const fullTitle = title.includes('VZ Dolci') ? title : `${title} | ${siteName}`;

  return (
    <Helmet>
      {/* Metadados Básicos */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph (Facebook, WhatsApp) */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="pt_BR" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Metadados Adicionais */}
      <meta name="robots" content={robots} />
      <meta name="author" content="VZ Dolci" />
      <meta name="theme-color" content="#5A2A83" />
    </Helmet>
  );
}

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  canonical: PropTypes.string,
  image: PropTypes.string,
  type: PropTypes.string,
  robots: PropTypes.string
};
