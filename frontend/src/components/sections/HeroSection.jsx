import React from 'react';
import { Volume2 } from 'lucide-react';
import { TRANSLATION_KEYS } from '../../constants/translationKeys';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import Button from '../ui/Button';

const HeroSection = ({ translations, speak, isSpeaking }) => {
  const { elementRef, hasBeenVisible } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });

  const handleListenClick = () => {
    const text = `${translations[TRANSLATION_KEYS.HERO_TITLE]}. ${translations[TRANSLATION_KEYS.HERO_SUBTITLE]}`;
    speak(text);
  };

  return (
    <section 
      ref={elementRef}
      className="relative overflow-hidden py-20 px-4 bg-gradient-to-br from-blue-50 via-white to-cyan-50"
      aria-labelledby="hero-title"
    >
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <div className={`transition-all duration-1000 ${hasBeenVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 
            id="hero-title"
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-cyan-600 to-sky-500 bg-clip-text text-transparent leading-tight"
          >
            {translations[TRANSLATION_KEYS.HERO_TITLE]}
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            {translations[TRANSLATION_KEYS.HERO_SUBTITLE]}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              size="lg"
              icon={Volume2}
              onClick={handleListenClick}
              disabled={isSpeaking}
              loading={isSpeaking}
              ariaLabel={isSpeaking ? 'Playing audio description' : 'Listen to page description'}
            >
              {translations[TRANSLATION_KEYS.HERO_LISTEN]}
            </Button>
            
            <Button
              variant="secondary"
              size="lg"
              onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
              ariaLabel="Scroll to products section"
            >
              {translations[TRANSLATION_KEYS.COMMON_DISCOVER]}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;