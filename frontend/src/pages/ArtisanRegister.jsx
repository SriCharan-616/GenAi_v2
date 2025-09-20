import React, { useState, useEffect } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { useSpeech } from '../hooks/useSpeech';
import { useNavigate } from 'react-router-dom';

import Navigation from '../components/common/Navigation';
import FloatingButtons from '../components/common/FloatingButtons';

const ArtisanRegister = () => {
  const [formData, setFormData] = useState({
  name: '',
  phone: '',
  email: '',
  password: '',         // <-- add this
  businessName: '',
  businessLocation: '',
  seller: 'seller'      // default to seller
});

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const {
    selectedLanguage,
    translations,
    languages,
    loading: translationsLoading,
    error: translationsError,
    changeLanguage
  } = useTranslations('en');

  const { speak, isSpeaking, isSupported } = useSpeech(selectedLanguage);
  const navigate = useNavigate();

  // Load saved login state
  useEffect(() => {
    const savedLoginState = localStorage.getItem('isLoggedIn');
    if (savedLoginState === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = translations.nameRequired || 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = translations.phoneRequired || 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = translations.phoneInvalid || 'Please enter a valid phone number';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = translations.emailInvalid || 'Please enter a valid email address';
    }

    if (!formData.businessName.trim()) {
      newErrors.businessName = translations.businessNameRequired || 'Business name is required';
    }

    if (!formData.businessLocation.trim()) {
      newErrors.businessLocation = translations.businessLocationRequired || 'Business location is required';
    }

    return newErrors;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newErrors = validateForm();
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setIsSubmitting(false);
        return;
      }
      console.log(formData);
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to register');
      }

      const result = await response.json();

      if (result.success) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('artisanData', JSON.stringify(result.user));
        navigate('/artisan-profile');
      } else {
        setErrors({ submit: result.message || 'Registration failed. Please try again.' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ submit: 'Registration failed. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 relative">
      <Navigation
        translations={translations}
        selectedLanguage={selectedLanguage}
        onLanguageChange={changeLanguage}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        languages={languages}
        loading={translationsLoading}
      />

      <main id="main-content" className="pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {translations.joinArtisanCommunity || 'Join Our Artisan Community'}
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                {translations.registerDescription ||
                  'Share your craftsmanship with the world and connect with customers who appreciate handmade quality.'}
              </p>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    {translations.fullName || 'Full Name'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={translations.enterFullName || 'Enter your full name'}
                  />
                  {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                </div>

                {/* Phone */}
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
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={translations.enterPhone || 'Enter your phone number'}
                  />
                  {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
                </div>
                    <div>
  <label htmlFor="password">Password <span className="text-red-500">*</span></label>
  <input
    type="password"
    id="password"
    name="password"
    value={formData.password}
    onChange={handleInputChange}
    className="w-full px-4 py-3 border rounded-xl"
    placeholder="Enter your password"
  />
</div>
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    {translations.email || 'Email'}{' '}
                    <span className="text-gray-500 text-xs">({translations.optional || 'Optional'})</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={translations.enterEmail || 'Enter your email address'}
                  />
                  {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                </div>

                {/* Business Name */}
                <div>
                  <label htmlFor="businessName" className="block text-sm font-semibold text-gray-700 mb-2">
                    {translations.businessName || 'Business Name'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.businessName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={translations.enterBusinessName || 'Enter your business name'}
                  />
                  {errors.businessName && <p className="mt-2 text-sm text-red-600">{errors.businessName}</p>}
                </div>

                {/* Business Location */}
                <div>
                  <label htmlFor="businessLocation" className="block text-sm font-semibold text-gray-700 mb-2">
                    {translations.businessLocation || 'Business Location'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="businessLocation"
                    name="businessLocation"
                    value={formData.businessLocation}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.businessLocation ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={translations.enterBusinessLocation || 'Enter your business location'}
                  />
                  {errors.businessLocation && (
                    <p className="mt-2 text-sm text-red-600">{errors.businessLocation}</p>
                  )}
                </div>

                {/* Submit Error */}
                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-sm text-red-600">{errors.submit}</p>
                  </div>
                )}

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
                      {translations.registering || 'Registering...'}
                    </div>
                  ) : (
                    translations.registerAsArtisan || 'Register as Artisan'
                  )}
                </button>
              </form>

              {/* Login Link */}
              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  {translations.alreadyRegistered || 'Already registered?'}{' '}
                  <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                    {translations.signIn || 'Sign in'}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FloatingButtons speak={speak} translations={translations} isSpeaking={isSpeaking} isLoggedIn={isLoggedIn} />

      {!isSupported && (
        <div className="fixed bottom-4 left-4 bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-2 rounded-lg shadow-lg z-40">
          {translations.speechNotSupported || 'Text-to-speech is not supported in your browser.'}
        </div>
      )}
    </div>
  );
};

export default ArtisanRegister;
