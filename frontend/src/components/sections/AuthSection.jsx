import React from 'react';
import { LogIn, UserPlus } from 'lucide-react';
import { TRANSLATION_KEYS } from '../../constants/translationKeys';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';

const AuthSection = ({ translations, isLoggedIn, setIsLoggedIn }) => {
  if (isLoggedIn) return null; // Don't show if already logged in
  const navigate = useNavigate();
  const handleSignIn = () => {
    // In a real app, this would open a sign-in modal or navigate to sign-in page
    setIsLoggedIn(true);
  };

  const handleRegister = () => {
    // In a real app, this would open a registration modal or navigate to registration page
    navigate('/register');
  };

  return (
    <section 
      className="py-12 px-4 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border-y border-blue-200/50"
      aria-labelledby="auth-title"
    >
      <div className="max-w-4xl mx-auto text-center">
        <h3 
          id="auth-title"
          className="text-2xl md:text-3xl font-bold mb-6 text-gray-800"
        >
          {translations[TRANSLATION_KEYS.AUTH_SELL_BUY_CONTEXT]}
        </h3>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            variant="secondary"
            size="lg"
            icon={LogIn}
            onClick={handleSignIn}
            ariaLabel="Sign in to your account"
          >
            {translations[TRANSLATION_KEYS.AUTH_SIGNIN]}
          </Button>
          
          <span className="text-gray-500 font-medium" aria-hidden="true">
            {translations[TRANSLATION_KEYS.AUTH_OR]}
          </span>
          
          <Button
            variant="primary"
            size="lg"
            icon={UserPlus}
            onClick={handleRegister}
            ariaLabel="Create a new account"
          >
            {translations[TRANSLATION_KEYS.AUTH_REGISTER]}
          </Button>
        </div>
        
        <p className="mt-4 text-sm text-gray-600 max-w-2xl mx-auto">
          Join thousands of artisans and customers in our growing marketplace
        </p>
      </div>
    </section>
  );
};

export default AuthSection;