import { useState } from 'react';
import './OptimizedImage.css';

/**
 * OptimizedImage component with native lazy loading and placeholder shimmer.
 * @param {string} src - Image URL
 * @param {string} alt - Alternate text for accessibility
 * @param {string} className - Additional CSS classes
 * @param {string} placeholderColor - Optional placeholder color
 */
export function OptimizedImage({
  src,
  alt,
  className = '',
  placeholderColor = '#f0f0f0',
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const isMissingRequiredProps = !src || !alt;
  const shouldShowPlaceholder = !isLoaded && !hasError && !isMissingRequiredProps;

  return (
    <div className={`optimized-image-container ${className}`}>
      {shouldShowPlaceholder && (
        <div
          className="image-placeholder"
          style={{ backgroundColor: placeholderColor }}
          aria-hidden="true"
        >
          <div className="placeholder-shimmer"></div>
        </div>
      )}

      {hasError || isMissingRequiredProps ? (
        <div className="image-error" role="alert" aria-live="polite">
          <span aria-hidden="true">🖼️</span>
          <p>Imagem não disponível</p>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`optimized-image ${isLoaded ? 'loaded' : ''}`}
          {...props}
        />
      )}
    </div>
  );
}
