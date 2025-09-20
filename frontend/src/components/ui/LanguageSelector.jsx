import React, { useState, useEffect } from 'react';
import TranslationService from '../../services/translationService';

const LanguageSelector = ({ selectedLanguage, onLanguageChange, className = '' }) => {
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load available languages on component mount
  useEffect(() => {
    const loadLanguages = async () => {
      try {
        setLoading(true);
        const languages = await TranslationService.getAvailableLanguages();
        setAvailableLanguages(languages);
        setError(null);
      } catch (err) {
        console.error('Failed to load languages:', err);
        setError(err.message);
        // Fallback languages
        const fallbackLanguages = [
          { code: 'en', name: 'English', flag: '🇺🇸' },
          { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
          { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
          { code: 'es', name: 'Español', flag: '🇪🇸' },
          { code: 'fr', name: 'Français', flag: '🇫🇷' }
        ];
        setAvailableLanguages(fallbackLanguages);
      } finally {
        setLoading(false);
      }
    };

    loadLanguages();
  }, []);

  // Handle loading state
  if (loading) {
    return (
      <select className={`${className} opacity-50`} disabled>
        <option>Loading languages...</option>
      </select>
    );
  }

  // Handle error state
  if (error) {
    console.error('Language selector error:', error);
    return (
      <select 
        className={`${className} opacity-75`}
        value={selectedLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
      >
        {availableLanguages.map(({ code, name, flag }) => (
          <option key={code} value={code}>
            {flag} {name}
          </option>
        ))}
      </select>
    );
  }

  // Handle case where availableLanguages is not yet loaded
  if (!availableLanguages || availableLanguages.length === 0) {
    return (
      <select className={`${className} opacity-50`} disabled>
        <option>No languages available</option>
      </select>
    );
  }

  return (
    <select 
      value={selectedLanguage} 
      onChange={(e) => onLanguageChange(e.target.value)}
      className={`${className} bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
      aria-label="Select language"
    >
      {availableLanguages.map(({ code, name, flag }) => (
        <option key={code} value={code}>
          {flag} {name}
        </option>
      ))}
    </select>
  );
};

export default LanguageSelector;