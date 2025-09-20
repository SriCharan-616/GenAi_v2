import React, { useState } from 'react';
import { ShoppingBag, User, Menu, X } from 'lucide-react';
import { TRANSLATION_KEYS } from '../../constants/translationKeys';
import LanguageSelector from '../ui/LanguageSelector';
import Button from '../ui/Button';

const Navigation = ({ 
  translations, 
  selectedLanguage, 
  onLanguageChange, 
  isLoggedIn, 
  setIsLoggedIn, 
  languages,
  loading 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { key: TRANSLATION_KEYS.NAV_HOME, href: '#home' },
    { key: TRANSLATION_KEYS.NAV_EXPLORE, href: '#explore' },
    { key: TRANSLATION_KEYS.NAV_ABOUT, href: '#about' },
    { key: TRANSLATION_KEYS.NAV_CONTACT, href: '#contact' }
  ];

  return (
    <nav 
      className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 transition-all duration-300 border-b border-blue-100"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-2 rounded-xl shadow-lg">
              <ShoppingBag className="w-6 h-6" aria-hidden="true" />
            </div>
            <span className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              ArtisanHub
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <a 
                key={link.key}
                href={link.href} 
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {translations[link.key]}
              </a>
            ))}
          </div>

          {/* Right Side - Language, Auth, Profile */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageChange={onLanguageChange}
              languages={languages}
              disabled={loading}
            />

            {/* Profile Button (only when logged in) */}
            <div className="hidden md:flex items-center">
              {isLoggedIn && (
                <Button
                  variant="primary"
                  size="md"
                  icon={User}
                  onClick={() => setIsLoggedIn(false)}
                  ariaLabel="Access profile menu"
                >
                  {translations[TRANSLATION_KEYS.NAV_MY_PROFILE]}
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div 
          className="lg:hidden bg-white/95 backdrop-blur-md border-t border-blue-100 py-4 space-y-2 px-4"
          role="menu"
          aria-label="Mobile navigation menu"
        >
          {navLinks.map((link) => (
            <a 
              key={link.key}
              href={link.href}
              className="block text-gray-700 hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              role="menuitem"
              onClick={() => setIsMenuOpen(false)}
            >
              {translations[link.key]}
            </a>
          ))}
          
          {/* Mobile Profile Button */}
          {isLoggedIn && (
            <div className="pt-2 border-t border-blue-100 mt-2">
              <Button
                variant="primary"
                size="md"
                icon={User}
                onClick={() => {
                  setIsLoggedIn(false);
                  setIsMenuOpen(false);
                }}
                className="w-full"
                ariaLabel="Access profile menu"
              >
                {translations[TRANSLATION_KEYS.NAV_MY_PROFILE]}
              </Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navigation;