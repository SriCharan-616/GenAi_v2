import React, { useState, useEffect } from 'react';

import { useSpeech } from '../hooks/useSpeech';
import { useNavigate } from 'react-router-dom';
import { useMyContext } from "../services/translationContext";

import Navigation from '../components/common/Navigation';
import FloatingButtons from '../components/common/FloatingButtons';

const ArtisanRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    businessName: '',
    businessLocation: '',
    seller: 'seller'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { text } = useMyContext();
  const { speak, isSpeaking, isSupported } = useSpeech('en');
  const navigate = useNavigate();

  // Load saved login state
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedLoginState = localStorage.getItem('isLoggedIn');
    if (token && savedLoginState === 'true') {
      setIsLoggedIn(true);
      // Optionally redirect if already logged in
      // navigate('/artisan-profile');
    }
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear field-specific errors when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear submit error when user makes changes
    if (errors.submit) {
      setErrors((prev) => ({
        ...prev,
        submit: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = text.nameRequired || 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = text.nameTooShort || 'Name must be at least 2 characters';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = text.phoneRequired || 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = text.phoneInvalid || 'Please enter a valid phone number';
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = text.passwordRequired || 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = text.passwordTooShort || 'Password must be at least 6 characters';
    }

    // Email validation (optional but must be valid if provided)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = text.emailInvalid || 'Please enter a valid email address';
    }

    // Business name validation
    if (!formData.businessName.trim()) {
      newErrors.businessName = text.businessNameRequired || 'Business name is required';
    }

    // Business location validation
    if (!formData.businessLocation.trim()) {
      newErrors.businessLocation = text.businessLocationRequired || 'Business location is required';
    }

    return newErrors;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({}); // Clear all errors

    try {
      // Validate form
      const newErrors = validateForm();
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setIsSubmitting(false);
        return;
      }

      console.log('Submitting registration data:', formData);

      const response = await fetch(`http://localhost:5000/api/auth/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      if (result.success && result.token) {
        // Store authentication data
        localStorage.setItem('token', result.token);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(result.user));
        
        console.log('Registration successful:', result.user);
        
        // Navigate to profile page
        navigate('/artisan-profile', { 
          state: { 
            message: 'Registration successful! Welcome to our artisan community.',
            user: result.user 
          }
        });
      } else {
        setErrors({ submit: result.message || text.registrationFailed || 'Registration failed' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle specific error types
      if (error.message.includes('409') || error.message.includes('already exists')) {
        setErrors({ submit: text.userAlreadyExists || 'User with this email or phone already exists' });
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        setErrors({ submit: text.networkError || 'Network error. Please check your connection.' });
      } else {
        setErrors({ submit: error.message || text.registrationFailedTryLater || 'Registration failed. Please try again later.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle navigation to login
  const handleLoginNavigation = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 relative">
      <Navigation />

      <main id="main-content" className="pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {text.joinArtisanCommunity || 'Join Our Artisan Community'}
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                {text.registerDescription || 'Register to showcase your crafts and connect with customers worldwide'}
              </p>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    {text.fullName || 'Full Name'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder={text.enterFullName || 'Enter your full name'}
                    autoComplete="name"
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    {text.phoneNumber || 'Phone Number'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder={text.enterPhone || 'Enter your phone number'}
                    autoComplete="tel"
                  />
                  {errors.phone && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className='block text-sm font-semibold text-gray-700 mb-2'>
                    {text.password || 'Password'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder={text.enterPassword || 'Enter your password (min 6 characters)'}
                    autoComplete="new-password"
                    minLength={6}
                  />
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    {text.email || 'Email'}{' '}
                    <span className="text-gray-500 text-xs">({text.optional || 'optional'})</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder={text.enterEmail || 'Enter your email (optional)'}
                    autoComplete="email"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Business Name */}
                <div>
                  <label htmlFor="businessName" className="block text-sm font-semibold text-gray-700 mb-2">
                    {text.businessName || 'Business Name'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.businessName ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder={text.enterBusinessName || 'Enter your business/craft name'}
                    autoComplete="organization"
                  />
                  {errors.businessName && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.businessName}
                    </p>
                  )}
                </div>

                {/* Business Location */}
                <div>
                  <label htmlFor="businessLocation" className="block text-sm font-semibold text-gray-700 mb-2">
                    {text.businessLocation || 'Business Location'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="businessLocation"
                    name="businessLocation"
                    value={formData.businessLocation}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.businessLocation ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder={text.enterBusinessLocation || 'Enter your city/location'}
                    autoComplete="address-level2"
                  />
                  {errors.businessLocation && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.businessLocation}
                    </p>
                  )}
                </div>

                {/* Submit Error */}
                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-pulse">
                    <div className="flex items-center">
                      <span className="text-red-500 mr-2">❌</span>
                      <p className="text-sm text-red-600 font-medium">{errors.submit}</p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transform hover:scale-105 shadow-lg hover:shadow-xl active:scale-95'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {text.registering || 'Registering...'}
                    </div>
                  ) : (
                    text.registerAsArtisan || 'Register as Artisan'
                  )}
                </button>
              </form>

              {/* Login Link */}
              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  {text.alreadyRegistered || 'Already have an account?'}{' '}
                  <button 
                    onClick={handleLoginNavigation}
                    className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors duration-200"
                  >
                    {text.signIn || 'Sign In'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FloatingButtons speak={speak} translations={text} isSpeaking={isSpeaking} isLoggedIn={isLoggedIn} />

      {!isSupported && (
        <div className="fixed bottom-4 left-4 bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-2 rounded-lg shadow-lg z-40">
          {text.speechNotSupported || 'Speech synthesis not supported in this browser'}
        </div>
      )}
    </div>
  );
};

export default ArtisanRegister;