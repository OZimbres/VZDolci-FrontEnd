import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ProductImage } from '../../../common/ProductImage/ProductImage';
import './ProductGallery.css';

/**
 * ProductGallery Component
 *
 * Galeria de imagens do produto com:
 * - Imagem principal grande
 * - Thumbnails clicáveis
 * - Modal de zoom em alta resolução
 * - Navegação por teclado (arrows)
 * - Swipe em mobile
 *
 * @example
 * <ProductGallery
 *   images={[
 *     { src: 'crema-abacaxi-hero', alt: 'Visão principal', type: 'hero' },
 *     { src: 'crema-abacaxi-top', alt: 'Vista superior', type: 'detail' },
 *     { src: 'crema-abacaxi-detail', alt: 'Detalhe da textura', type: 'detail' }
 *   ]}
 *   productName="Crema Cotta Abacaxi"
 * />
 */
export function ProductGallery({ images, productName }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const hasImages = Array.isArray(images) && images.length > 0;
  const activeImage = hasImages ? images[activeIndex] : null;

  /**
   * Navegar para próxima/anterior imagem
   */
  const goToImage = (index) => {
    if (index < 0 || index >= images.length) return;
    setActiveIndex(index);
  };

  const goToNext = () => goToImage(activeIndex + 1);
  const goToPrevious = () => goToImage(activeIndex - 1);

  /**
   * Abrir modal de zoom
   */
  const openZoom = () => {
    setIsZoomOpen(true);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  };

  const closeZoom = () => {
    setIsZoomOpen(false);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  };

  /**
   * Navegação por teclado
   */
  useEffect(() => {
    if (!isZoomOpen || !hasImages) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          setIsZoomOpen(false);
          if (typeof document !== 'undefined') {
            document.body.style.overflow = '';
          }
          break;
        case 'ArrowLeft':
          setActiveIndex((current) =>
            current > 0 ? current - 1 : current
          );
          break;
        case 'ArrowRight':
          setActiveIndex((current) => {
            const nextIndex = current + 1;
            return nextIndex < images.length ? nextIndex : current;
          });
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasImages, images.length, isZoomOpen]);

  /**
   * Garantir que o scroll seja restaurado ao desmontar
   */
  useEffect(() => {
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, []);

  /**
   * Swipe em mobile
   */
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) goToNext();
    if (isRightSwipe) goToPrevious();

    setTouchStart(null);
    setTouchEnd(null);
  };

  if (!hasImages) {
    return null;
  }

  return (
    <div className="product-gallery">
      {/* Imagem Principal */}
      <div
        className="gallery-main"
        onClick={openZoom}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && openZoom()}
        aria-label={`Ampliar imagem de ${productName}`}
      >
        <ProductImage
          src={activeImage.src}
          alt={activeImage.alt || `${productName} - ${activeIndex + 1}`}
          aspectRatio="4/3"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={activeIndex === 0}
        />

        {/* Badge de tipo de imagem */}
        <div className="image-type-badge">
          {activeImage.type === 'hero' && '✨ Principal'}
          {activeImage.type === 'detail' && '🔍 Detalhe'}
          {activeImage.type === 'top' && '👁️ Vista Superior'}
        </div>

        {/* Botões de navegação (desktop) */}
        {images.length > 1 && (
          <>
            <button
              className="gallery-nav-btn prev"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              disabled={activeIndex === 0}
              aria-label="Imagem anterior"
            >
              ‹
            </button>
            <button
              className="gallery-nav-btn next"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              disabled={activeIndex === images.length - 1}
              aria-label="Próxima imagem"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="gallery-thumbnails">
          {images.map((image, index) => (
            <button
              key={index}
              className={`gallery-thumbnail ${index === activeIndex ? 'active' : ''}`}
              onClick={() => goToImage(index)}
              aria-label={`Ver imagem ${index + 1}`}
              aria-pressed={index === activeIndex}
            >
              <ProductImage
                src={image.src}
                alt={`Miniatura ${index + 1}`}
                aspectRatio="1/1"
                sizes="100px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Indicador de posição (mobile) */}
      {images.length > 1 && (
        <div className="gallery-indicators">
          {images.map((_, index) => (
            <button
              key={index}
              className={`indicator-dot ${index === activeIndex ? 'active' : ''}`}
              onClick={() => goToImage(index)}
              aria-label={`Ir para imagem ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Modal de Zoom */}
      {isZoomOpen && (
        <div
          className="gallery-zoom-modal"
          onClick={closeZoom}
          role="dialog"
          aria-modal="true"
          aria-label="Visualização ampliada"
        >
          <div className="zoom-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={`/images/products/${activeImage.src}@2x.jpg`}
              alt={activeImage.alt || `${productName} - ${activeIndex + 1}`}
              className="zoom-image"
            />

            {/* Botão de fechar */}
            <button
              className="zoom-close"
              onClick={closeZoom}
              aria-label="Fechar visualização"
            >
              ✕
            </button>

            {/* Navegação no modal */}
            {images.length > 1 && (
              <>
                <button
                  className="zoom-nav-btn prev"
                  onClick={goToPrevious}
                  disabled={activeIndex === 0}
                  aria-label="Imagem anterior"
                >
                  ‹
                </button>
                <button
                  className="zoom-nav-btn next"
                  onClick={goToNext}
                  disabled={activeIndex === images.length - 1}
                  aria-label="Próxima imagem"
                >
                  ›
                </button>
              </>
            )}

            {/* Contador de imagens */}
            <div className="zoom-counter">
              {activeIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

ProductGallery.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string.isRequired,
      alt: PropTypes.string,
      type: PropTypes.oneOf(['hero', 'detail', 'top']),
    })
  ).isRequired,
  productName: PropTypes.string.isRequired,
};
