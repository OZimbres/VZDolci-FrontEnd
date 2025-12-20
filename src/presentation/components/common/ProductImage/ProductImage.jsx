import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './ProductImage.css';

const BASE_PATH = '/images/products';

const generateSrcSet = (filename, format) => {
  return `
      ${BASE_PATH}/${filename}@mobile.${format} 400w,
      ${BASE_PATH}/${filename}.${format} 800w,
      ${BASE_PATH}/${filename}@2x.${format} 1600w
    `.trim();
};

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
  const pictureRef = useRef(null);

  /**
   * Handlers de loading
   */
  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  const handleError = (event) => {
    setHasError(true);
    const imageElement = event?.currentTarget || imgRef.current;
    const computedSrc =
      imageElement?.currentSrc ||
      imageElement?.src ||
      imageElement?.dataset?.src ||
      `${BASE_PATH}/${src}`;
    const pageLocation =
      typeof window !== 'undefined' && window.location
        ? window.location.href
        : 'window.location unavailable (non-browser environment)';

    console.error('Erro ao carregar imagem em ProductImage:', {
      srcProp: src,
      computedSrc,
      alt,
      aspectRatio,
      sizes,
      priority,
      pageLocation,
    });
  };

  /**
   * Intersection Observer para lazy loading manual (fallback)
   */
  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observedImg = imgRef.current;

    const loadImage = () => {
      if (
        observedImg.dataset.src &&
        (!observedImg.src || observedImg.src !== observedImg.dataset.src)
      ) {
        const picture =
          pictureRef.current ||
          (observedImg.parentElement?.nodeName === 'PICTURE'
            ? observedImg.parentElement
            : null);
        if (picture) {
          picture.querySelectorAll('source').forEach((source) => {
            if (
              source.dataset.srcset &&
              source.srcset !== source.dataset.srcset
            ) {
              source.srcset = source.dataset.srcset;
            }
          });
        }
        observedImg.src = observedImg.dataset.src;
      }
    };

    if (!('IntersectionObserver' in window)) {
      loadImage();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadImage();
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px', // Carregar 50px antes de aparecer
      }
    );

    if (observedImg) {
      observer.observe(observedImg);
    }

    return () => {
      if (observedImg) {
        observer.unobserve(observedImg);
      }
      observer.disconnect();
    };
  }, [priority, src]);

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  const defaultSrc = `${BASE_PATH}/${src}.jpg`;

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
        <picture ref={pictureRef}>
          {/* WebP para navegadores modernos */}
          <source
            type="image/webp"
            srcSet={priority ? generateSrcSet(src, 'webp') : undefined}
            data-srcset={!priority ? generateSrcSet(src, 'webp') : undefined}
            sizes={sizes}
          />

          {/* JPEG fallback */}
          <source
            type="image/jpeg"
            srcSet={priority ? generateSrcSet(src, 'jpg') : undefined}
            data-srcset={!priority ? generateSrcSet(src, 'jpg') : undefined}
            sizes={sizes}
          />

          {/* Imagem padrão */}
          <img
            ref={imgRef}
            src={priority ? defaultSrc : undefined}
            data-src={priority ? undefined : defaultSrc}
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
          <span
            className="error-icon"
            role="img"
            aria-label="Erro ao carregar imagem"
          >
            ⚠
          </span>
          <p role="alert">Imagem indisponível</p>
        </div>
      )}

      {/* Zoom Overlay (apenas desktop) */}
      {isLoaded && (
        <div className="product-image-zoom-hint">
          <span
            className="zoom-icon"
            aria-label="Passe o mouse para ampliar a imagem"
          >
            Zoom disponível
          </span>
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
