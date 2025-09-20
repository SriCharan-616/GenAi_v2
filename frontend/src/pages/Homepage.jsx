import React, { useState, useEffect } from 'react';
import { useTranslator } from '../services/translationContext'; // ✅ Use context instead
import { useSpeech } from '../hooks/useSpeech';
import { useSEO } from '../utils/seo';
import { homepageSEO, generateStructuredData } from '../utils/seo';

// Components
import BackgroundAnimation from '../components/common/BackgroundAnimation';
import Navigation from '../components/common/Navigation';
import FloatingButtons from '../components/common/FloatingButtons';
import HeroSection from '../components/sections/HeroSection';
import AuthSection from '../components/sections/AuthSection';
import IntroSection from '../components/sections/IntroSection';
import ProductDisplay from '../components/sections/ProductDisplay';
import SampleImages from '../components/sections/SampleImages';
import ReviewsSection from '../components/sections/ReviewsSection';
import ExploreMore from '../components/sections/ExploreMore';

const Homepage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // ✅ Use the context system instead of useTranslations hook
  const { language, translations, t, setLanguage } = useTranslator();

  const { speak, stop, isSpeaking, isSupported } = useSpeech(language);

  // SEO Setup
  const seoConfig = {
    ...homepageSEO,
    structuredData: generateStructuredData(),
    hreflang: {
      'en': window.location.href,
      'es': window.location.href + '?lang=es',
      'hi': window.location.href + '?lang=hi',
      'fr': window.location.href + '?lang=fr',
      'de': window.location.href + '?lang=de',
      'ar': window.location.href + '?lang=ar'
    }
  };

  useSEO(seoConfig);

  // Load saved login state
  useEffect(() => {
    const savedLoginState = localStorage.getItem('isLoggedIn');
    if (savedLoginState === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  // Save login state
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn.toString());
  }, [isLoggedIn]);

  // Loading state - simplified since context handles loading
  if (!translations || Object.keys(translations).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading ArtisanHub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 relative">
      {/* Background Animation */}
      <BackgroundAnimation />

      {/* Navigation - ✅ Remove all translation props */}
      <Navigation 
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
      />

      {/* Main Content - ✅ Remove all translation props */}
      <main id="main-content">
        <HeroSection speak={speak} isSpeaking={isSpeaking} />
        <AuthSection isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <IntroSection />
        <ProductDisplay />
        <SampleImages />
        <ReviewsSection />
        <ExploreMore />
      </main>

      {/* Floating Action Buttons - ✅ Remove translation props */}
      <FloatingButtons speak={speak} isSpeaking={isSpeaking} isLoggedIn={isLoggedIn} />

      {/* Error boundary for speech not supported */}
      {!isSupported && (
        <div 
          className="fixed bottom-4 left-4 bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-2 rounded-lg shadow-lg z-40"
          role="alert"
          aria-live="polite"
        >
          Text-to-speech is not supported in your browser.
        </div>
      )}
    </div>
  );
};

export default Homepage;