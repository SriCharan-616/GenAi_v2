import { useState, useRef, useEffect } from 'react';

// Utility for image lazy loading
export const useLazyImage = (src, placeholder = '') => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [imageRef, setImageRef] = useState();

  useEffect(() => {
    let observer;
    
    if (imageRef && imageSrc === placeholder) {
      observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              // Start loading the actual image
              const img = new Image();
              img.onload = () => {
                setImageSrc(src);
              };
              img.onerror = () => {
                console.error(`Failed to load image: ${src}`);
                // Keep placeholder or set error image
                setImageSrc(placeholder || '/images/image-error.svg');
              };
              img.src = src;
              
              observer.unobserve(imageRef);
            }
          });
        },
        { threshold: 0.1 }
      );
      
      observer.observe(imageRef);
    }
    
    return () => {
      if (observer && imageRef) {
        observer.unobserve(imageRef);
      }
    };
  }, [imageRef, imageSrc, placeholder, src]);

  return [setImageRef, imageSrc];
};

// Lazy Image Component
export const LazyImage = ({ 
  src, 
  alt, 
  placeholder, 
  className = '', 
  onLoad,
  onError,
  ...props 
}) => {
  const [imageRef, setImageRef] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [imageSrc, setImageSrc] = useState(placeholder);

  useEffect(() => {
    let observer;
    
    if (imageRef && !isLoaded && !isError) {
      observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              // Start loading the actual image
              const img = new Image();
              
              img.onload = () => {
                setImageSrc(src);
                setIsLoaded(true);
                onLoad && onLoad();
              };
              
              img.onerror = () => {
                console.error(`Failed to load image: ${src}`);
                setIsError(true);
                setImageSrc(placeholder || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5Ij5JbWFnZSBVbmF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=');
                onError && onError();
              };
              
              img.src = src;
              observer.unobserve(imageRef);
            }
          });
        },
        { 
          threshold: 0.1,
          rootMargin: '50px' // Start loading 50px before the image enters viewport
        }
      );
      
      observer.observe(imageRef);
    }
    
    return () => {
      if (observer && imageRef) {
        observer.unobserve(imageRef);
      }
    };
  }, [imageRef, isLoaded, isError, src, placeholder, onLoad, onError]);

  return (
    <img
      ref={setImageRef}
      src={imageSrc}
      alt={alt}
      className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-70'} transition-opacity duration-300`}
      loading="lazy"
      {...props}
    />
  );
};

// Progressive Image Loading Hook
export const useProgressiveImage = (src, placeholder) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setLoading(false);
    };
    
    img.onerror = () => {
      setError(true);
      setLoading(false);
    };
    
    img.src = src;
  }, [src]);

  return { imageSrc, loading, error };
};