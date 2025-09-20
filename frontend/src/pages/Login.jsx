import React, { useState, useEffect } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { useSpeech } from '../hooks/useSpeech';
import { useNavigate } from 'react-router-dom';

// Components
import Navigation from '../components/common/Navigation';
import FloatingButtons from '../components/common/FloatingButtons';

const Login = () => {
  const [formData, setFormData] = useState({ emailOrPhone: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { selectedLanguage, translations, languages, loading: translationsLoading, changeLanguage } = useTranslations('en');
  const { speak, stop, isSpeaking, isSupported } = useSpeech(selectedLanguage);
  const navigate = useNavigate();

  // Check localStorage only once on mount
  useEffect(() => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      navigate('/artisan-profile', { replace: true });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = translations.emailOrPhoneRequired || 'Email/Phone is required';
    }
    if (!formData.password.trim()) {
      newErrors.password = translations.passwordRequired || 'Password is required';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        setErrors({ submit: result.message || 'Login failed. Please try again.' });
        return;
      }

      // Save to localStorage
      localStorage.setItem('currentUser', JSON.stringify(result.user));
      localStorage.setItem('isLoggedIn', 'true');

      // Navigate immediately - no state needed
      navigate('/artisan-profile', { replace: true });

    } catch (error) {
      console.error('Login error:', error);
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simple loading check
  if (translationsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 relative">
      <Navigation
        translations={translations}
        selectedLanguage={selectedLanguage}
        onLanguageChange={changeLanguage}
        // Navigation can check localStorage directly too
        isLoggedIn={localStorage.getItem('isLoggedIn') === 'true'}
        languages={languages}
        loading={translationsLoading}
      />

      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {translations.welcomeBack || 'Welcome Back'}
              </h1>
              <p className="text-lg text-gray-600">
                {translations.loginDescription || 'Sign in to your ArtisanHub account'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="emailOrPhone" className="block text-sm font-semibold text-gray-700 mb-2">
                  {translations.emailOrPhone || 'Email or Phone'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="emailOrPhone"
                  name="emailOrPhone"
                  value={formData.emailOrPhone}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.emailOrPhone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={translations.enterEmailOrPhone || 'Enter your email or phone'}
                />
                {errors.emailOrPhone && (
                  <p className="mt-2 text-sm text-red-600">{errors.emailOrPhone}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  {translations.password || 'Password'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={translations.enterPassword || 'Enter your password'}
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-sm text-red-600">{errors.submit}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transform hover:scale-105 shadow-lg hover:shadow-xl'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {translations.signingIn || 'Signing In...'}
                  </div>
                ) : (
                  translations.signIn || 'Sign In'
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">
                {translations.noAccount || "Don't have an account?"}
              </p>
              <div className="space-y-2">
                <a
                  href="/artisan-register"
                  className="block w-full py-3 px-4 bg-green-100 text-green-700 rounded-xl font-medium hover:bg-green-200 transition-colors"
                >
                  {translations.artisanSignup || 'Register as Artisan'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FloatingButtons 
        speak={speak} 
        translations={translations} 
        isSpeaking={isSpeaking}
        isLoggedIn={localStorage.getItem('isLoggedIn') === 'true'}
      />
    </div>
  );
};

export default Login;