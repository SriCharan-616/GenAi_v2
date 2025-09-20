import React, { useState, useEffect } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { useSpeech } from '../hooks/useSpeech';
import { useSEO } from '../utils/seo';
import { homepageSEO, generateStructuredData } from '../utils/seo';
import '../styles/Homepage.css';

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
  
  const {
    selectedLanguage,
    translations,
    languages,
    loading: translationsLoading,
    error: translationsError,
    changeLanguage
  } = useTranslations('en');

  const { speak, stop, isSpeaking, isSupported } = useSpeech(selectedLanguage);

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

  // Handle translation errors
  useEffect(() => {
    if (translationsError) {
      console.error('Translation error:', translationsError);
    }
  }, [translationsError]);

  // Loading state
  if (translationsLoading && Object.keys(translations).length === 0) {
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

      {/* Global CSS for animations (fixed: removed jsx/global) */}
      

      {/* Skip to main content link for accessibility */}
      <a 
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50"
      >
        Skip to main content
      </a>

      {/* Navigation */}
      <Navigation 
        translations={translations}
        selectedLanguage={selectedLanguage}
        onLanguageChange={changeLanguage}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        languages={languages}
        loading={translationsLoading}
      />

      {/* Main Content */}
      <main id="main-content">
        <HeroSection translations={translations} speak={speak} isSpeaking={isSpeaking} />
        <AuthSection translations={translations} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <IntroSection translations={translations} />
        <ProductDisplay translations={translations} />
        <SampleImages translations={translations} />
        <ReviewsSection translations={translations} />
        <ExploreMore translations={translations} />
      </main>

      {/* Floating Action Buttons */}
      <FloatingButtons speak={speak} translations={translations} isSpeaking={isSpeaking} isLoggedIn={isLoggedIn} />

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
