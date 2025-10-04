import { useState, useRef, useEffect } from 'react';

const OptimizedImage = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 75,
  placeholder = true,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!loading || loading === 'eager');
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    if (loading === 'lazy' && imgRef.current && !observerRef.current) {
      const img = imgRef.current;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              observer.unobserve(img);
            }
          });
        },
        { rootMargin: '50px' }
      );

      observer.observe(img);
      observerRef.current = observer;

      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      };
    }
  }, [loading]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  // Generate srcSet for responsive images if it's our optimized image URL
  const generateSrcSet = () => {
    if (src && src.includes('/uploads/blog-images/optimized/')) {
      const baseName = src.replace('-optimized.webp', '');
      return `
        ${baseName}-small.webp 600w,
        ${baseName}-medium.webp 800w,
        ${baseName}-optimized.webp 1200w
      `;
    }
    return null;
  };

  // Handle external URLs by adding crossOrigin for better loading
  const imageProps = {
    ...(src.startsWith('http') ? { crossOrigin: 'anonymous' } : {}),
    loading: loading === 'eager' ? 'eager' : 'lazy',
    decoding: 'async'
  };

  if (hasError) {
    return (
      <div
        className={`bg-gray-800 flex items-center justify-center text-gray-400 text-sm ${className}`}
        style={{ aspectRatio: '16/9' }}
      >
        <div className="text-center">
          <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
          </svg>
          Image failed to load
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Blur placeholder */}
      {placeholder && !isLoaded && (
        <div
          className="absolute inset-0 bg-gray-800 animate-pulse"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23374151'/%3E%3C/svg%3E")`,
            backgroundSize: '20px 20px'
          }}
        />
      )}

      {isInView && (
        <img
          ref={imgRef}
          src={src}
          srcSet={generateSrcSet()}
          sizes={sizes}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          {...imageProps}
          {...props}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
