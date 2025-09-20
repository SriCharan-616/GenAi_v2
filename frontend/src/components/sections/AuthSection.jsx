import React from 'react';
import { LogIn, UserPlus } from 'lucide-react';
import { TRANSLATION_KEYS } from '../../constants/translationKeys';
import { useTranslator } from '../../services/translationContext'; // ✅ Add this import
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';

const AuthSection = ({ isLoggedIn, setIsLoggedIn }) => { // ✅ Remove translations prop
  const { t } = useTranslator(); // ✅ Add this hook
  
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
          {t(TRANSLATION_KEYS.AUTH_SELL_BUY_CONTEXT)} {/* ✅ Use t() function */}
        </h3>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            variant="secondary"
            size="lg"
            icon={LogIn}
            onClick={handleSignIn}
            ariaLabel="Sign in to your account"
          >
            {t(TRANSLATION_KEYS.AUTH_SIGNIN)} {/* ✅ Use t() function */}
          </Button>
          
          <span className="text-gray-500 font-medium" aria-hidden="true">
            {t(TRANSLATION_KEYS.AUTH_OR)} {/* ✅ Use t() function */}
          </span>
          
          <Button
            variant="primary"
            size="lg"
            icon={UserPlus}
            onClick={handleRegister}
            ariaLabel="Create a new account"
          >
            {t(TRANSLATION_KEYS.AUTH_REGISTER)} {/* ✅ Use t() function */}
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