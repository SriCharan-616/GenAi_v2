import React from 'react';
import { ShoppingBag, User, LogOut } from 'lucide-react';
import { TRANSLATION_KEYS } from '../../constants/translationKeys';
import LanguageSelector from '../ui/LanguageSelector';
import Button from '../ui/Button';
import { useTranslator } from '../../services/translationContext';
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
  const { t, language, setLanguage, languages } = useTranslator();
  const navigate = useNavigate();

  const navLinks = [
    { key: TRANSLATION_KEYS.NAV_HOME, href: '/' },
    { key: TRANSLATION_KEYS.NAV_EXPLORE, href: '#explore' },
    { key: TRANSLATION_KEYS.NAV_ABOUT, href: '#about' },
    { key: TRANSLATION_KEYS.NAV_CONTACT, href: '#contact' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  // Always check localStorage for login status
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

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

          {isLoggedIn ? (
  <>
    <Button
      variant="primary"
      size="sm" // smaller size
      icon={User}
      onClick={() => navigate('/artisan-profile')}
      ariaLabel="Access profile menu"
      className="px-3 py-1 text-sm" // optional fine-tuning
    >
      {t(TRANSLATION_KEYS.NAV_MY_PROFILE)}
    </Button>

    <Button
      variant="secondary"
      size="sm" // smaller size
      icon={LogOut}
      onClick={handleLogout}
      ariaLabel="Logout"
      className="px-3 py-1 text-sm" // optional fine-tuning
    >
      {t(TRANSLATION_KEYS.NAV_LOGOUT) || 'Logout'}
    </Button>
  </>
) : (
  <Button
    variant="primary"
    size="md"
    onClick={() => navigate('/login')}
  >
    {t(TRANSLATION_KEYS.NAV_LOGIN) || 'Login'}
  </Button>
)}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
