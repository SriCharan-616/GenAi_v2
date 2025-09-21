import React, { useState } from 'react';
import { ShoppingBag, User, LogOut } from 'lucide-react';
import { useMyContext } from "../../services/translationContext";
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../ui/LoadingSpinner';

const Navigation = ({ body }) => {
  const { text, setText } = useMyContext();
  const navigate = useNavigate();

  const [isTranslating, setIsTranslating] = useState(false);
  const currentLanguage = localStorage.getItem('currentLanguage') || 'en';

  const availableLanguages = {
    'en': 'English', 'hi': 'हिन्दी', 'bn': 'বাংলা', 'te': 'తెలుగు',
    'mr': 'मराठी', 'ta': 'தமிழ்', 'gu': 'ગુજરાતી', 'ur': 'اردو',
    'kn': 'ಕನ್ನಡ', 'or': 'ଓଡ଼ିଆ', 'pa': 'ਪੰਜਾਬੀ', 'as': 'অসমীয়া',
    'ml': 'മലയാളം', 'fr': 'Français', 'es': 'Español', 'de': 'Deutsch',
    'it': 'Italiano', 'pt': 'Português', 'ru': 'Русский', 'ja': '日本語',
    'ko': '한국어', 'zh': '中文', 'ar': 'العربية'
};

  const onLanguageChange = async (newLang) => {
    localStorage.setItem('currentLanguage', newLang);
    setIsTranslating(true); // start full-page loading

    try {
      const response = await fetch('http://localhost:5000/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lang: newLang, text }),
      });

      if (!response.ok) throw new Error('Failed to fetch translations');

      const data = await response.json();
      setText(data);
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(false); // stop loading
    }
  };

  const navLinks = [
    { key: text.home, href: '/' },
    { key: text.explore, href: '#explore' },
    { key: text.about, href: '#about' },
    { key: text.contact, href: '#contact' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  return (
    <>
      {/* Full-page loading overlay */}
      {isTranslating && (
        <div className="fixed inset-0 bg-white/70 z-50 flex items-center justify-center">
          <LoadingSpinner className="w-12 h-12 text-blue-600" />
        </div>
      )}

      <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-40 border-b border-blue-100">
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
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-lg hover:bg-blue-50"
              >
                {link.key}
              </a>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <select
              value={currentLanguage}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="border rounded px-2 py-1"
            >
              {Object.entries(availableLanguages).map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>

            {isLoggedIn && (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  icon={User}
                  onClick={() => navigate('/artisan-profile')}
                  ariaLabel="Access profile menu"
                  className="px-3 py-1 text-sm"
                >
                  {text.myProfile}
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  icon={LogOut}
                  onClick={handleLogout}
                  ariaLabel="Logout"
                  className="px-3 py-1 text-sm"
                >
                  {text.logout}
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
