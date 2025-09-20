import React from 'react';
import { TRANSLATION_KEYS } from '../../constants/translationKeys';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { useTranslator } from '../../services/translationContext'; // ✅ Add this import
import { LazyImage } from '../../utils/lazyLoading';
import Card from '../ui/Card';

const SampleImages = () => { // ✅ Remove translations prop
  const { t } = useTranslator(); // ✅ Add this hook
  const { elementRef, hasBeenVisible } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });

  const sampleImages = [
    { 
      before: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&q=50", 
      after: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200",
      alt: "Handwoven basket enhancement"
    },
    { 
      before: "https://images.unsplash.com/photo-1578749556568-bc2c40e68399?w=200&q=50", 
      after: "https://images.unsplash.com/photo-1578749556568-bc2c40e68399?w=200",
      alt: "Ceramic vase enhancement"
    },
    { 
      before: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&q=50", 
      after: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200",
      alt: "Wooden bowl enhancement"
    }
  ];

  return (
    <section 
      id="samples-section" 
      ref={elementRef}
      className="py-16 px-4 bg-gradient-to-r from-blue-100/50 to-cyan-100/50 backdrop-blur-sm"
      aria-labelledby="samples-title"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        <div className={`transition-all duration-1000 delay-400 ${hasBeenVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 
            id="samples-title"
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
          >
            {t(TRANSLATION_KEYS.SAMPLE_TITLE)} {/* ✅ Use t() function */}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sampleImages.map((sample, index) => (
              <Card 
                key={index} 
                className="p-6"
                role="img"
                aria-label={`${sample.alt} before and after comparison`}
              >
                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      {t(TRANSLATION_KEYS.SAMPLE_BEFORE)} {/* ✅ Use t() function */}
                    </p>
                    <LazyImage 
                      src={sample.before} 
                      alt={`${sample.alt} - before enhancement`}
                      className="w-full h-32 object-cover rounded-xl"
                      placeholder="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTQ5NGE0Ij5CZWZvcmU8L3RleHQ+PC9zdmc+"
                    />
                  </div>
                  
                  <div className="flex flex-col items-center" aria-hidden="true">
                    <div className="w-8 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600"></div>
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full mt-1"></div>
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      {t(TRANSLATION_KEYS.SAMPLE_AFTER)} {/* ✅ Use t() function */}
                    </p>
                    <LazyImage 
                      src={sample.after} 
                      alt={`${sample.alt} - after enhancement`}
                      className="w-full h-32 object-cover rounded-xl"
                      placeholder="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ci8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTQ5NGE0Ij5BZnRlcjwvdGV4dD48L3N2Zz4="
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SampleImages;