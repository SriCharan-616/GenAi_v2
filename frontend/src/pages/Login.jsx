import React, { useState, useEffect } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { useSpeech } from '../hooks/useSpeech';

import { useNavigate } from 'react-router-dom';

// Components
import Navigation from '../components/common/Navigation';
import FloatingButtons from '../components/common/FloatingButtons';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    loginType: 'email' // 'email' or 'phone'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const {
    selectedLanguage,
    translations,
    languages,
    loading: translationsLoading,
    error: translationsError,
    changeLanguage
  } = useTranslations('en');

  const { speak, stop, isSpeaking, isSupported } = useSpeech(selectedLanguage);
  const navigate = useNavigate();

  // SEO Setup
  

  // Load saved login state
  useEffect(() => {
    const savedLoginState = localStorage.getItem('isLoggedIn');
    if (savedLoginState === 'true') {
      setIsLoggedIn(true);
      // Redirect if already logged in
      const savedUserType = localStorage.getItem('userType');
      if (savedUserType === 'artisan') {
        navigate('/artisan-profile');
      } else {
        navigate('/');
      }
    }
  }, [navigate]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle login type toggle
  const handleLoginTypeToggle = (type) => {
    setFormData(prev => ({
      ...prev,
      loginType: type,
      email: '',
      phone: ''
    }));
    setErrors({});
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (formData.loginType === 'email') {
      if (!formData.email.trim()) {
        newErrors.email = translations.emailRequired || 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = translations.emailInvalid || 'Please enter a valid email address';
      }
    } else {
      if (!formData.phone.trim()) {
        newErrors.phone = translations.phoneRequired || 'Phone number is required';
      } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
        newErrors.phone = translations.phoneInvalid || 'Please enter a valid phone number';
      }
    }
    
    if (!formData.password.trim()) {
      newErrors.password = translations.passwordRequired || 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = translations.passwordTooShort || 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if user exists in localStorage
      const savedArtisanData = localStorage.getItem('artisanData');
      let userData = null;
      let userType = 'customer';
      
      if (savedArtisanData) {
        const artisanData = JSON.parse(savedArtisanData);
        
        // Check if login credentials match artisan data
        const isArtisanMatch = (
          (formData.loginType === 'email' && artisanData.email === formData.email) ||
          (formData.loginType === 'phone' && artisanData.phone === formData.phone)
        );
        
        if (isArtisanMatch) {
          userData = artisanData;
          userType = 'artisan';
        }
      }
      
      // For demo purposes, allow any valid email/phone with password "123456"
      if (formData.password === '123456' || userData) {
        // Save login state
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userType', userType);
        
        if (userData) {
          localStorage.setItem('currentUser', JSON.stringify(userData));
        } else {
          // Create a basic customer profile
          const customerData = {
            id: Date.now().toString(),
            email: formData.loginType === 'email' ? formData.email : '',
            phone: formData.loginType === 'phone' ? formData.phone : '',
            name: 'Customer', // This would normally come from registration
            type: 'customer',
            loginDate: new Date().toISOString()
          };
          localStorage.setItem('currentUser', JSON.stringify(customerData));
        }
        
        // Redirect based on user type
        if (userType === 'artisan') {
          navigate('/artisan-profile');
        } else {
          navigate('/');
        }
        
      } else {
        setErrors({ submit: translations.invalidCredentials || 'Invalid credentials. Please try again.' });
      }
      
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ submit: translations.loginError || 'Login failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle forgot password
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    const identifier = formData.loginType === 'email' ? formData.email : formData.phone;
    if (!identifier.trim()) {
      setErrors({ 
        [formData.loginType]: formData.loginType === 'email' 
          ? translations.emailRequired || 'Email is required' 
          : translations.phoneRequired || 'Phone number is required'
      });
      return;
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert(translations.resetLinkSent || `Password reset instructions sent to your ${formData.loginType}.`);
      setShowForgotPassword(false);
      
    } catch (error) {
      setErrors({ submit: translations.resetError || 'Failed to send reset instructions. Please try again.' });
    }
  };

  // Loading state
  if (translationsLoading && Object.keys(translations).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading ArtisanHub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 relative">
      
      {/* Navigation */}
      <Navigation 
        translations={translations}
        selectedLanguage={selectedLanguage}
        onLanguageChange={changeLanguage}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        languages={languages}
        loading={translationsLoading}
      />

      {/* Main Content */}
      <main id="main-content" className="pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {translations.welcomeBack || 'Welcome Back'}
              </h1>
              <p className="text-lg text-gray-600">
                {translations.loginDescription || 'Sign in to your ArtisanHub account'}
              </p>
            </div>

            {/* Login Form */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
              
              {/* Login Type Toggle */}
              <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => handleLoginTypeToggle('email')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                    formData.loginType === 'email'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {translations.emailLogin || 'Email'}
                </button>
                <button
                  type="button"
                  onClick={() => handleLoginTypeToggle('phone')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                    formData.loginType === 'phone'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {translations.phoneLogin || 'Phone'}
                </button>
              </div>

              {!showForgotPassword ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Email/Phone Field */}
                  {formData.loginType === 'email' ? (
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        {translations.email || 'Email'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder={translations.enterEmail || 'Enter your email address'}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        autoComplete="email"
                      />
                      {errors.email && (
                        <p id="email-error" className="mt-2 text-sm text-red-600" role="alert">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                        {translations.phoneNumber || 'Phone Number'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder={translations.enterPhone || 'Enter your phone number'}
                        aria-describedby={errors.phone ? 'phone-error' : undefined}
                        autoComplete="tel"
                      />
                      {errors.phone && (
                        <p id="phone-error" className="mt-2 text-sm text-red-600" role="alert">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Password Field */}
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
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder={translations.enterPassword || 'Enter your password'}
                      aria-describedby={errors.password ? 'password-error' : undefined}
                      autoComplete="current-password"
                    />
                    {errors.password && (
                      <p id="password-error" className="mt-2 text-sm text-red-600" role="alert">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Forgot Password Link */}
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      {translations.forgotPassword || 'Forgot Password?'}
                    </button>
                  </div>

                  {/* Submit Error */}
                  {errors.submit && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="text-sm text-red-600" role="alert">
                        {errors.submit}
                      </p>
                    </div>
                  )}

                  {/* Demo Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-blue-800">
                      <strong>{translations.demoInfo || 'Demo Info'}:</strong> {translations.demoCredentials || 'Use password "123456" to login with any email/phone.'}
                    </p>
                  </div>

                  {/* Submit Button */}
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
              ) : (
                /* Forgot Password Form */
                <form onSubmit={handleForgotPassword} className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      {translations.resetPassword || 'Reset Password'}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {translations.resetPasswordDescription || 'Enter your email or phone to receive reset instructions'}
                    </p>
                  </div>

                  {/* Email/Phone Field for Reset */}
                  {formData.loginType === 'email' ? (
                    <div>
                      <label htmlFor="resetEmail" className="block text-sm font-semibold text-gray-700 mb-2">
                        {translations.email || 'Email'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="resetEmail"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder={translations.enterEmail || 'Enter your email address'}
                      />
                      {errors.email && (
                        <p className="mt-2 text-sm text-red-600" role="alert">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <label htmlFor="resetPhone" className="block text-sm font-semibold text-gray-700 mb-2">
                        {translations.phoneNumber || 'Phone Number'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="resetPhone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder={translations.enterPhone || 'Enter your phone number'}
                      />
                      {errors.phone && (
                        <p className="mt-2 text-sm text-red-600" role="alert">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Reset Buttons */}
                  <div className="space-y-3">
                    <button
                      type="submit"
                      className="w-full py-3 px-6 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                    >
                      {translations.sendResetInstructions || 'Send Reset Instructions'}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(false)}
                      className="w-full py-3 px-6 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                    >
                      {translations.backToLogin || 'Back to Login'}
                    </button>
                  </div>
                </form>
              )}

              {/* Registration Links */}
              {!showForgotPassword && (
                <div className="mt-8 space-y-4">
                  <div className="text-center">
                    <p className="text-gray-600">
                      {translations.noAccount || "Don't have an account?"}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <a
                      href="/register"
                      className="block text-center py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                    >
                      {translations.customerSignup || 'Customer Signup'}
                    </a>
                    <a
                      href="/artisan-register"
                      className="block text-center py-3 px-4 bg-green-100 text-green-700 rounded-xl font-medium hover:bg-green-200 transition-colors"
                    >
                      {translations.artisanSignup || 'Artisan Signup'}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Buttons */}
      <FloatingButtons 
        speak={speak} 
        translations={translations} 
        isSpeaking={isSpeaking}
        isLoggedIn={isLoggedIn}
      />

      {/* Error boundary for speech not supported */}
      {!isSupported && (
        <div 
          className="fixed bottom-4 left-4 bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-2 rounded-lg shadow-lg z-40"
          role="alert"
          aria-live="polite"
        >
          {translations.speechNotSupported || 'Text-to-speech is not supported in your browser.'}
        </div>
      )}
    </div>
  );
};

export default Login;