import { useState, useEffect } from 'react';
import translationService from '../services/translationService';

export const useTranslations = (initialLanguage = 'en') => {
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage);
  const [translations, setTranslations] = useState({});
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load available languages
  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const availableLanguages = await translationService.getAvailableLanguages();
        setLanguages(availableLanguages);
      } catch (err) {
        console.error('Failed to load languages:', err);
        setError('Failed to load available languages');
      }
    };

    loadLanguages();
  }, []);

  // Load translations when language changes
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const newTranslations = await translationService.fetchTranslations(selectedLanguage);
        setTranslations(newTranslations);
      } catch (err) {
        console.error('Failed to load translations:', err);
        setError(`Failed to load translations for ${selectedLanguage}`);
      } finally {
        setLoading(false);
      }
    };

    loadTranslations();
  }, [selectedLanguage]);

  const changeLanguage = async (languageCode) => {
    if (languageCode === selectedLanguage) return;
    
    setSelectedLanguage(languageCode);
    // Save to localStorage for persistence
    localStorage.setItem('selectedLanguage', languageCode);
  };

  // Load saved language on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage && savedLanguage !== selectedLanguage) {
      setSelectedLanguage(savedLanguage);
    }
  }, []);

  return {
    selectedLanguage,
    translations,
    languages,
    loading,
    error,
    changeLanguage
  };
};