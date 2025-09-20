import { useState, useEffect } from 'react';
import translationService from '../services/translationService';

export const useTranslations = (language = 'en') => {
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load available languages
  const loadLanguages = async () => {
    try {
      setLoading(true);
      const languages = await translationService.getAvailableLanguages();
      setAvailableLanguages(languages);
      setError(null);
    } catch (err) {
      console.error('Failed to load languages:', err);
      setError(err.message);
      // Fallback languages will be set by the service
      const fallbackLanguages = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
        { code: 'es', name: 'Español', flag: '🇪🇸' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' }
      ];
      setAvailableLanguages(fallbackLanguages);
    } finally {
      setLoading(false);
    }
  };

  // Load translations for specific language
  const loadTranslations = async (lang) => {
    try {
      const translatedData = await translationService.fetchTranslations(lang);
      setTranslations(prev => ({
        ...prev,
        [lang]: translatedData
      }));
    } catch (err) {
      console.error(`Failed to load translations for ${lang}:`, err);
      // Service already handles fallbacks
    }
  };

  useEffect(() => {
    loadLanguages();
  }, []);

  useEffect(() => {
    if (language) {
      loadTranslations(language);
    }
  }, [language]);

  const t = (key, fallback = key) => {
    return translations[language]?.[key] || fallback;
  };

  return {
    availableLanguages,
    translations: translations[language] || {},
    loading,
    error,
    t,
    loadLanguages,
    loadTranslations
  };
};