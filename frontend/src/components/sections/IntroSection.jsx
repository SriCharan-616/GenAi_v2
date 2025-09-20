import React from 'react';
import { TRANSLATION_KEYS } from '../../constants/translationKeys';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { useTranslator } from '../../services/translationContext'; // ✅ Add this import

const IntroSection = () => { // ✅ Remove translations prop
  const { t } = useTranslator(); // ✅ Add this hook
  
  const { elementRef, hasBeenVisible } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <section 
      id="intro-section" 
      ref={elementRef}
      className="py-16 px-4 bg-white/70 backdrop-blur-sm"
      aria-labelledby="intro-title"
    >
      <div className="max-w-6xl mx-auto">
        <div className={`text-center transition-all duration-1000 delay-200 ${hasBeenVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 
            id="intro-title"
            className="text-3xl md:text-4xl font-bold mb-8 text-gray-800"
          >
            {t(TRANSLATION_KEYS.INTRO_WHO_WE_ARE)} {/* ✅ Use t() function */}
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {t(TRANSLATION_KEYS.INTRO_TEXT)} {/* ✅ Use t() function */}
          </p>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;