import React from 'react';
import { useTranslations } from '../../hooks/useTranslations';

const LanguageSelector = ({ currentLanguage, onLanguageChange}) => {
  

  // Handle loading state
  

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