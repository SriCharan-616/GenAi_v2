import React, { useState } from 'react';
import { ShoppingBag, User, Menu, X } from 'lucide-react';
import { TRANSLATION_KEYS } from '../../constants/translationKeys';
import LanguageSelector from '../ui/LanguageSelector';
import Button from '../ui/Button';
import { useTranslator } from '../../services/translationContext';

const Navigation = ({ isLoggedIn, setIsLoggedIn }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { t, language, setLanguage, languages } = useTranslator();

  const navLinks = [
    { key: TRANSLATION_KEYS.NAV_HOME, href: '#home' },
    { key: TRANSLATION_KEYS.NAV_EXPLORE, href: '#explore' },
    { key: TRANSLATION_KEYS.NAV_ABOUT, href: '#about' },
    { key: TRANSLATION_KEYS.NAV_CONTACT, href: '#contact' }
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-2 rounded-xl shadow-lg">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <span className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            ArtisanHub
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center space-x-6">
          {navLinks.map((link) => (
            <a
              key={link.key}
              href={link.href}
              className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-lg hover:bg-blue-50"
            >
              {t(link.key)}
            </a>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          <LanguageSelector
            selectedLanguage={language}
            onLanguageChange={setLanguage}
            languages={languages}
          />

          {isLoggedIn && (
            <Button
              variant="primary"
              size="md"
              icon={User}
              onClick={() => setIsLoggedIn(false)}
              ariaLabel="Access profile menu"
            >
              {t(TRANSLATION_KEYS.NAV_MY_PROFILE)}
            </Button>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-blue-50"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white/95 border-t border-blue-100 py-4 space-y-2 px-4">
          {navLinks.map((link) => (
            <a
              key={link.key}
              href={link.href}
              className="block text-gray-700 py-2 px-3 rounded-lg hover:bg-blue-50"
              onClick={() => setIsMenuOpen(false)}
            >
              {t(link.key)}
            </a>
          ))}

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
              >
                {t(TRANSLATION_KEYS.NAV_MY_PROFILE)}
              </Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navigation;
