import React, { useState, useEffect } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { useSpeech } from '../hooks/useSpeech';
import { useSEO } from '../utils/seo';
import '../styles/ArtisanRegister.css';

// Components
import BackgroundAnimation from '../components/common/BackgroundAnimation';
import Navigation from '../components/common/Navigation';
import FloatingButtons from '../components/common/FloatingButtons';

const ArtisanRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    profession: ''
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

  const { speak, stop, isSpeaking, isSupported } = useSpeech(selectedLanguage);

  // SEO Setup
  const seoConfig = {
    title: 'Register as Artisan - ArtisanHub',
    description: 'Join ArtisanHub as an artisan and showcase your handcrafted products to customers worldwide.',
    keywords: 'artisan registration, handmade products, craft marketplace, artisan signup',
    canonical: window.location.href,
    ogTitle: 'Register as Artisan - ArtisanHub',
    ogDescription: 'Join our community of skilled artisans and grow your handcraft business.',
    ogType: 'website'
  };

  useSEO(seoConfig);

  // Load saved login state
  useEffect(() => {
    const savedLoginState = localStorage.getItem('isLoggedIn');
    if (savedLoginState === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

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

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = translations.nameRequired || 'Name is required';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = translations.addressRequired || 'Address is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = translations.phoneRequired || 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = translations.phoneInvalid || 'Please enter a valid phone number';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = translations.emailInvalid || 'Please enter a valid email address';
    }
    
    if (!formData.profession.trim()) {
      newErrors.profession = translations.professionRequired || 'Profession is required';
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
      
      // Save artisan data to localStorage (in real app, this would be an API call)
      const artisanData = {
        ...formData,
        id: Date.now().toString(),
        registrationDate: new Date().toISOString(),
        products: []
      };
      
      localStorage.setItem('artisanData', JSON.stringify(artisanData));
      localStorage.setItem('isLoggedIn', 'true');
      
      // Redirect to profile page
      window.location.href = '/artisan-profile';
      
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ submit: translations.registrationError || 'Registration failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
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

  const professionOptions = [
    'Woodworker',
    'Potter',
    'Weaver',
    'Jeweler',
    'Metalsmith',
    'Painter',
    'Sculptor',
    'Glassblower',
    'Leatherworker',
    'Textile Artist',
    'Ceramic Artist',
    'Other'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 relative">
      {/* Background Animation */}
      <BackgroundAnimation />
      
      {/* Global CSS for animations */}
     
      {/* Skip to main content link for accessibility */}
      

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
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {translations.joinArtisanCommunity || 'Join Our Artisan Community'}
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                {translations.registerDescription || 'Share your craftsmanship with the world and connect with customers who appreciate handmade quality.'}
              </p>
            </div>

            {/* Registration Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
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
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={translations.enterFullName || 'Enter your full name'}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-2 text-sm text-red-600" role="alert">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Address Field */}
                <div>
                  <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                    {translations.address || 'Address'} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-vertical ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={translations.enterAddress || 'Enter your complete address'}
                    aria-describedby={errors.address ? 'address-error' : undefined}
                  />
                  {errors.address && (
                    <p id="address-error" className="mt-2 text-sm text-red-600" role="alert">
                      {errors.address}
                    </p>
                  )}
                </div>

                {/* Phone Field */}
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
                  />
                  {errors.phone && (
                    <p id="phone-error" className="mt-2 text-sm text-red-600" role="alert">
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Email Field (Optional) */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    {translations.email || 'Email'} 
                    <span className="text-gray-500 text-xs ml-2">
                      ({translations.optional || 'Optional'})
                    </span>
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
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-2 text-sm text-red-600" role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Profession Field */}
                <div>
                  <label htmlFor="profession" className="block text-sm font-semibold text-gray-700 mb-2">
                    {translations.profession || 'Profession'} <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="profession"
                    name="profession"
                    value={formData.profession}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.profession ? 'border-red-500' : 'border-gray-300'
                    }`}
                    aria-describedby={errors.profession ? 'profession-error' : undefined}
                  >
                    <option value="">
                      {translations.selectProfession || 'Select your profession'}
                    </option>
                    {professionOptions.map((profession) => (
                      <option key={profession} value={profession}>
                        {translations[profession.toLowerCase()] || profession}
                      </option>
                    ))}
                  </select>
                  {errors.profession && (
                    <p id="profession-error" className="mt-2 text-sm text-red-600" role="alert">
                      {errors.profession}
                    </p>
                  )}
                </div>

                {/* Submit Error */}
                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-sm text-red-600" role="alert">
                      {errors.submit}
                    </p>
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
                  <a
                    href="/login"
                    className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                  >
                    {translations.signIn || 'Sign in'}
                  </a>
                </p>
              </div>
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

export default ArtisanRegister;