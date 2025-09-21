import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMyContext } from "../services/translationContext";
// Components
import Navigation from '../components/common/Navigation';

const Login = () => {
  const [formData, setFormData] = useState({ emailOrPhone: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { text } = useMyContext();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (token && isLoggedIn === 'true') {
      // Redirect to intended page or profile
      const redirectTo = location.state?.from?.pathname || '/artisan-profile';
      navigate(redirectTo, { replace: true });
    }
  }, [navigate, location]);

  // Display success message from registration
  useEffect(() => {
    if (location.state?.message) {
      // Could show a toast notification here
      console.log('Success message:', location.state.message);
    }
  }, [location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field-specific errors
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear submit error when user makes changes
    if (errors.submit) {
      setErrors(prev => ({ ...prev, submit: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = text.emailOrPhoneRequired || 'Email or phone is required';
    } else {
      // Basic validation for email or phone format
      const value = formData.emailOrPhone.trim();
      const isEmail = value.includes('@');
      const isPhone = /^\+?[\d\s\-\(\)]+$/.test(value);
      
      if (!isEmail && !isPhone) {
        newErrors.emailOrPhone = text.invalidEmailOrPhone || 'Please enter a valid email or phone number';
      }
    }
    
    if (!formData.password.trim()) {
      newErrors.password = text.passwordRequired || 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = text.passwordTooShort || 'Password must be at least 6 characters';
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
          if (result.message.includes('User not found')) {
            setErrors({ emailOrPhone: text.userNotFound || 'User not found' });
          } else if (result.message.includes('password')) {
            setErrors({ password: text.incorrectPassword || 'Incorrect password' });
          } else {
            setErrors({ submit: result.message || text.invalidCredentials || 'Invalid credentials' });
          }
        } else {
          setErrors({ submit: result.message || text.loginFailed || 'Login failed. Please try again.' });
        }
        return;
      }

      if (result.token && result.user) {
      
        // Store authentication data
        localStorage.setItem('token', result.token);
        localStorage.setItem('currentUser', JSON.stringify(result.user));
        localStorage.setItem('isLoggedIn', 'true');

        console.log('Login successful:', result.user);

        // Navigate to intended page or profile
        const redirectTo = location.state?.from?.pathname || '/artisan-profile';
        navigate(redirectTo, { 
          replace: true,
          state: { 
            message: `Welcome back, ${result.user.name}!`,
            user: result.user 
          }
        });
      } else {
        setErrors({ submit: text.loginFailed || 'Login failed. Please try again.' });
      }

    } catch (error) {
      console.error('Login error:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setErrors({ submit: text.networkError || 'Network error. Please check your connection.' });
      } else {
        setErrors({ submit: text.loginFailedTryLater || 'Login failed. Please try again later.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterNavigation = (e) => {
    e.preventDefault();
    navigate('/register');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 relative">
      <Navigation/>

      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {text.welcomeBack || 'Welcome Back'}
              </h1>
              <p className="text-lg text-gray-600">
                {text.loginDescription || 'Sign in to your artisan account'}
              </p>
            </div>

            {/* Success message from registration */}
            {location.state?.message && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✅</span>
                  <p className="text-sm text-green-600 font-medium">{location.state.message}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              
              {/* Email/Phone Input */}
              <div>
                <label htmlFor="emailOrPhone" className="block text-sm font-semibold text-gray-700 mb-2">
                  {text.emailOrPhone || 'Email or Phone'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="emailOrPhone"
                  name="emailOrPhone"
                  value={formData.emailOrPhone}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.emailOrPhone ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder={text.enterEmailOrPhone || 'Enter your email or phone number'}
                  autoComplete="username"
                />
                {errors.emailOrPhone && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.emailOrPhone}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  {text.password || 'Password'} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12 ${
                      errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder={text.enterPassword || 'Enter your password'}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    tabIndex={-1}
                  >
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.password}
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
                    {text.signingIn || 'Signing in...'}
                  </div>
                ) : (
                  text.signIn || 'Sign In'
                )}
              </button>
            </form>

            {/* Registration Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">
                {text.noAccount || "Don't have an account?"}
              </p>
              <div className="space-y-2">
                <button
                  onClick={handleRegisterNavigation}
                  className="block w-full py-3 px-4 bg-green-100 text-green-700 rounded-xl font-medium hover:bg-green-200 transition-colors duration-200 hover:shadow-md"
                >
                  {text.artisanSignup || 'Register as Artisan'}
                </button>
              </div>
            </div>

            {/* Forgot Password Link (Future Enhancement) */}
            <div className="mt-4 text-center">
              <button 
                type="button"
                onClick={() => console.log('Forgot password clicked')} // Implement later
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-200"
              >
                {text.forgotPassword || 'Forgot your password?'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;