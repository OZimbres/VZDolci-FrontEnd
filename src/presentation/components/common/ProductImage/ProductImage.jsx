import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './ProductImage.css';

/**
 * ProductImage Component
 * * Componente responsivo para exibir imagens de produtos com:
 * - Lazy loading nativo
 * - Suporte WebP com fallback JPEG
 * - Múltiplas resoluções (srcset)
 * - Blur placeholder durante carregamento
 * - Zoom ao hover (desktop)
 * * @example
 * <ProductImage
 * src="crema-abacaxi-hero"
 * alt="Crema Cotta Sabor Abacaxi"
 * aspectRatio="4/3"
 * sizes="(max-width: 768px) 100vw, 50vw"
 * />
 */
export function ProductImage({
  src,
  alt,
  aspectRatio = '4/3',
  sizes = '100vw',
  priority = false,
  onLoad,
  className = '',
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  // Base path para imagens
  const BASE_PATH = '/images/products';

  /**
   * Gera srcset para diferentes resoluções
   * Exemplo: "image.webp 800w, image@2x.webp 1600w"
   */
  const generateSrcSet = (filename, format) => {
    return `
      ${BASE_PATH}/${filename}.${format} 800w,
      ${BASE_PATH}/${filename}@2x.${format} 1600w,
      ${BASE_PATH}/${filename}@mobile.${format} 400w
    `.trim();
  };

  /**
   * Handlers de loading
   */
  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setHasError(true);
    console.error(`Erro ao carregar imagem: ${src}`);
  };

  /**
   * Intersection Observer para lazy loading manual (fallback)
   */
  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Imagem está visível, forçar carregamento
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
            }
            observer.unobserve(img);
          }
        });
      },
      {
        rootMargin: '50px', // Carregar 50px antes de aparecer
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [priority]);

  return (
    <div
      className={`product-image-wrapper ${className}`}
      style={{ aspectRatio }}
    >
      {/* Blur Placeholder */}
      {!isLoaded && !hasError && (
        <div className="product-image-placeholder">
          <div className="shimmer-effect" />
        </div>
      )}

      {/* Imagem Principal com WebP e Fallback */}
      {!hasError && (
        <picture>
          {/* WebP para navegadores modernos */}
          <source
            type="image/webp"
            srcSet={generateSrcSet(src, 'webp')}
            sizes={sizes}
          />

          {/* JPEG fallback */}
          <source
            type="image/jpeg"
            srcSet={generateSrcSet(src, 'jpg')}
            sizes={sizes}
          />

          {/* Imagem padrão */}
          <img
            ref={imgRef}
            src={`${BASE_PATH}/${src}.jpg`}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={handleLoad}
            onError={handleError}
            className={`product-image ${isLoaded ? 'loaded' : ''}`}
          />
        </picture>
      )}

      {/* Fallback caso imagem não carregue */}
      {hasError && (
        <div className="product-image-error">
          <span className="error-icon">📷</span>
          <p>Imagem indisponível</p>
        </div>
      )}

      {/* Zoom Overlay (apenas desktop) */}
      {isLoaded && (
        <div className="product-image-zoom-hint">
          <span className="zoom-icon">🔍</span>
        </div>
      )}
    </div>
  );
}

ProductImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  aspectRatio: PropTypes.string,
  sizes: PropTypes.string,
  priority: PropTypes.bool,
  onLoad: PropTypes.func,
  className: PropTypes.string,
};
