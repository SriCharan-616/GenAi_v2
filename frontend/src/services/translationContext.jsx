import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import TranslationService from './translationService';

// Create context
const TranslatorContext = createContext({
  language: 'en',
  translations: {},
  setLanguage: () => {},
  t: (key) => key,
});

// Provider component
export function TranslatorProvider({ children, defaultLanguage = 'en' }) {
  const [language, setLanguage] = useState(defaultLanguage);
  const [translations, setTranslations] = useState({});

  // Fetch translations whenever language changes
  useEffect(() => {
    let isMounted = true;

    TranslationService.fetchTranslations(language)
      .then((data) => {
        if (isMounted) setTranslations(data);
      })
      .catch((error) => {
        console.error('Failed to fetch translations:', error);
      });

    return () => {
      isMounted = false;
    };
  }, [language]);

  // Helper function to translate keys
  const t = useCallback(
    (key) => translations[key] || key,
    [translations]
  );

  return (
    <TranslatorContext.Provider value={{ language, setLanguage, translations, t }}>
      {children}
    </TranslatorContext.Provider>
  );
}

// Custom hook
export function useTranslator() {
  return useContext(TranslatorContext);
}
