import React from 'react';
import { ChevronDown } from 'lucide-react';

const LanguageSelector = ({ 
  selectedLanguage, 
  onLanguageChange, 
  languages, 
  className = '',
  disabled = false 
}) => {
  return (
    <div className={`relative ${className}`}>
      <select
        value={selectedLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
        disabled={disabled}
        className="bg-white border-2 border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer pr-8 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Select language"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
      <ChevronDown 
        className="absolute right-2 top-3 w-4 h-4 pointer-events-none text-gray-500" 
        aria-hidden="true"
      />
    </div>
  );
};

export default LanguageSelector;