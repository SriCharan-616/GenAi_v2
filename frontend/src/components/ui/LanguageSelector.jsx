import React from 'react';
import { useTranslations } from '../../hooks/useTranslations';

const LanguageSelector = ({ currentLanguage, onLanguageChange, className = '' }) => {
  const { availableLanguages, loading, error } = useTranslations();

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
      <select className={`${className} opacity-50`} disabled>
        <option>Error loading languages</option>
      </select>
    );
  }

  // Handle case where availableLanguages is not yet loaded or is undefined
  if (!availableLanguages || Object.keys(availableLanguages).length === 0) {
    return (
      <select className={`${className} opacity-50`} disabled>
        <option>No languages available</option>
      </select>
    );
  }

  return (
    <select 
      value={currentLanguage} 
      onChange={(e) => onLanguageChange(e.target.value)}
      className={className}
    >
      {Array.isArray(availableLanguages) ? 
        availableLanguages.map(({ code, name, flag }) => (
          <option key={code} value={code}>
            {flag} {name}
          </option>
        )) :
        Object.entries(availableLanguages).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))
      }
    </select>
  );
};

export default LanguageSelector;