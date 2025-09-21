import React, { useState, useEffect } from 'react';
import { useSpeech } from '../hooks/useSpeech';

import { useNavigate } from 'react-router-dom';
// Components

import Navigation from '../components/common/Navigation';
import FloatingButtons from '../components/common/FloatingButtons';

const ArtisanProfile = () => {
    const navigate = useNavigate();
  const [artisanData, setArtisanData] = useState(null);
  const [activeTab, setActiveTab] = useState('create'); // 'create' or 'products'
  
  const [showProductForm, setShowProductForm] = useState(true);
  
  // Product form state
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    photo: null,
    photoPreview: null,
    price: '',
    category: ''
  });
  const [productErrors, setProductErrors] = useState({});
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);

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
  

  // Load artisan data and login state
  useEffect(() => {
    const savedArtisanData = localStorage.getItem('artisanData');
    const savedLoginState = localStorage.getItem('isLoggedIn');
    
    if (savedLoginState === 'false') {
      navigate('/');
      return;
    }
    
    
    if (savedArtisanData) {
      setArtisanData(JSON.parse(savedArtisanData));
    }
  }, []);

  // Handle product form input changes
  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setProductForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (productErrors[name]) {
      setProductErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle photo upload
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setProductErrors(prev => ({
          ...prev,
          photo: translations.photoTooLarge || 'Photo size must be less than 5MB'
        }));
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setProductForm(prev => ({
          ...prev,
          photo: file,
          photoPreview: e.target.result
        }));
      };
      reader.readAsDataURL(file);
      
      // Clear photo error
      if (productErrors.photo) {
        setProductErrors(prev => ({
          ...prev,
          photo: ''
        }));
      }
    }
  };

  // Validate product form
  const validateProductForm = () => {
    const errors = {};
    
    if (!productForm.name.trim()) {
      errors.name = translations.productNameRequired || 'Product name is required';
    }
    
    if (!productForm.description.trim()) {
      errors.description = translations.descriptionRequired || 'Description is required';
    } else if (productForm.description.length < 20) {
      errors.description = translations.descriptionTooShort || 'Description must be at least 20 characters';
    }
    
    if (!productForm.photo) {
      errors.photo = translations.photoRequired || 'Product photo is required';
    }
    
    if (!productForm.price || parseFloat(productForm.price) <= 0) {
      errors.price = translations.priceRequired || 'Valid price is required';
    }
    
    if (!productForm.category) {
      errors.category = translations.categoryRequired || 'Category is required';
    }
    
    return errors;
  };

  // Handle product form submission
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateProductForm();
    if (Object.keys(errors).length > 0) {
      setProductErrors(errors);
      return;
    }
    
    setIsSubmittingProduct(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create new product
      const newProduct = {
        id: Date.now().toString(),
        name: productForm.name,
        description: productForm.description,
        photo: productForm.photoPreview, // In real app, this would be uploaded to server
        price: parseFloat(productForm.price),
        category: productForm.category,
        createdAt: new Date().toISOString(),
        status: 'active'
      };
      
      // Update artisan data with new product
      const updatedArtisanData = {
        ...artisanData,
        products: [...(artisanData.products || []), newProduct]
      };
      
      setArtisanData(updatedArtisanData);
      localStorage.setItem('artisanData', JSON.stringify(updatedArtisanData));
      
      // Reset form
      setProductForm({
        name: '',
        description: '',
        photo: null,
        photoPreview: null,
        price: '',
        category: ''
      });
      
      // Switch to products tab to show the new product
      setActiveTab('products');
      
    } catch (error) {
      console.error('Product creation error:', error);
      setProductErrors({ submit: translations.productCreationError || 'Failed to create product. Please try again.' });
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  // Loading state
  if (!artisanData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading Artisan Data...</p>
        </div>
      </div>
    );
  }

  const categoryOptions = [
    'Woodwork',
    'Pottery',
    'Textiles',
    'Jewelry',
    'Metalwork',
    'Paintings',
    'Sculptures',
    'Glasswork',
    'Leatherwork',
    'Ceramics',
    'Other'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 relative">
      

      {/* Navigation */}
      <Navigation 
        translations={translations}
        selectedLanguage={selectedLanguage}
        onLanguageChange={changeLanguage}
        
        languages={languages}
        loading={translationsLoading}
      />

      {/* Main Content */}
      <main id="main-content" className="pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {translations.welcome || 'Welcome'}, {artisanData.name}!
            </h1>
            <p className="text-xl text-gray-600">
              {translations.artisanDashboard || 'Manage your artisan business and showcase your products'}
            </p>
          </div>

          {/* Profile Summary */}
          

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('create')}
                  className={`py-4 px-6 text-sm font-semibold transition-colors ${
                    activeTab === 'create'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {translations.createProduct || 'Create New Product'}
                </button>
                <button
                  onClick={() => setActiveTab('products')}
                  className={`py-4 px-6 text-sm font-semibold transition-colors ${
                    activeTab === 'products'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {translations.myProducts || 'My Products'} ({artisanData.products?.length || 0})
                </button>
              </nav>
            </div>

            <div className="p-6 md:p-8">
              {/* Create Product Tab */}
              {activeTab === 'create' && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    {translations.createNewProduct || 'Create New Product'}
                  </h3>
                  
                  <form onSubmit={handleProductSubmit} className="space-y-6">
                    {/* Product Name */}
                    <div>
                      <label htmlFor="productName" className="block text-sm font-semibold text-gray-700 mb-2">
                        {translations.productName || 'Product Name'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="productName"
                        name="name"
                        value={productForm.name}
                        onChange={handleProductInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          productErrors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder={translations.enterProductName || 'Enter product name'}
                        aria-describedby={productErrors.name ? 'productName-error' : undefined}
                      />
                      {productErrors.name && (
                        <p id="productName-error" className="mt-2 text-sm text-red-600" role="alert">
                          {productErrors.name}
                        </p>
                      )}
                    </div>

                    {/* Category */}
                    <div>
                      <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                        {translations.category || 'Category'} <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={productForm.category}
                        onChange={handleProductInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          productErrors.category ? 'border-red-500' : 'border-gray-300'
                        }`}
                        aria-describedby={productErrors.category ? 'category-error' : undefined}
                      >
                        <option value="">
                          {translations.selectCategory || 'Select category'}
                        </option>
                        {categoryOptions.map((category) => (
                          <option key={category} value={category}>
                            {translations[category.toLowerCase()] || category}
                          </option>
                        ))}
                      </select>
                      {productErrors.category && (
                        <p id="category-error" className="mt-2 text-sm text-red-600" role="alert">
                          {productErrors.category}
                        </p>
                      )}
                    </div>

                    {/* Price */}
                    <div>
                      <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                        {translations.price || 'Price'} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-3 text-gray-500">₹</span>
                        <input
                          type="number"
                          id="price"
                          name="price"
                          value={productForm.price}
                          onChange={handleProductInputChange}
                          min="1"
                          step="0.01"
                          className={`w-full pl-8 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                            productErrors.price ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="0.00"
                          aria-describedby={productErrors.price ? 'price-error' : undefined}
                        />
                      </div>
                      {productErrors.price && (
                        <p id="price-error" className="mt-2 text-sm text-red-600" role="alert">
                          {productErrors.price}
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                        {translations.description || 'Description'} <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={productForm.description}
                        onChange={handleProductInputChange}
                        rows={4}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-vertical ${
                          productErrors.description ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder={translations.enterDescription || 'Describe your product, materials used, dimensions, etc.'}
                        aria-describedby={productErrors.description ? 'description-error' : undefined}
                      />
                      <div className="mt-1 text-sm text-gray-500">
                        {productForm.description.length}/500 characters
                      </div>
                      {productErrors.description && (
                        <p id="description-error" className="mt-2 text-sm text-red-600" role="alert">
                          {productErrors.description}
                        </p>
                      )}
                    </div>

                    {/* Photo Upload */}
                    <div>
                      <label htmlFor="photo" className="block text-sm font-semibold text-gray-700 mb-2">
                        {translations.productPhoto || 'Product Photo'} <span className="text-red-500">*</span>
                      </label>
                      <div className="space-y-4">
                        <input
                          type="file"
                          id="photo"
                          name="photo"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                            productErrors.photo ? 'border-red-500' : 'border-gray-300'
                          }`}
                          aria-describedby={productErrors.photo ? 'photo-error' : undefined}
                        />
                        
                        {/* Photo Preview */}
                        {productForm.photoPreview && (
                          <div className="mt-4">
                            <p className="text-sm font-semibold text-gray-700 mb-2">
                              {translations.preview || 'Preview'}:
                            </p>
                            <div className="relative inline-block">
                              <img
                                src={productForm.photoPreview}
                                alt="Product preview"
                                className="w-48 h-48 object-cover rounded-xl shadow-lg"
                              />
                              <button
                                type="button"
                                onClick={() => setProductForm(prev => ({ ...prev, photo: null, photoPreview: null }))}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                                aria-label="Remove photo"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {productErrors.photo && (
                          <p id="photo-error" className="mt-2 text-sm text-red-600" role="alert">
                            {productErrors.photo}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Submit Error */}
                    {productErrors.submit && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <p className="text-sm text-red-600" role="alert">
                          {productErrors.submit}
                        </p>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmittingProduct}
                      className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 ${
                        isSubmittingProduct
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transform hover:scale-105 shadow-lg hover:shadow-xl'
                      }`}
                    >
                      {isSubmittingProduct ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          {translations.creatingProduct || 'Creating Product...'}
                        </div>
                      ) : (
                        translations.createProduct || 'Create Product'
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* My Products Tab */}
              {activeTab === 'products' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {translations.myProducts || 'My Products'}
                    </h3>
                    <button
                      onClick={() => setActiveTab('create')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {translations.addNewProduct || 'Add New Product'}
                    </button>
                  </div>
                  
                  {artisanData.products && artisanData.products.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {artisanData.products.map((product) => (
                        <div key={product.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-shadow">
                          <div className="aspect-square w-full bg-gray-200 rounded-lg mb-4 overflow-hidden">
                            <img
                              src={product.photo}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-2">{product.name}</h4>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-3">{product.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-blue-600">₹{product.price}</span>
                            <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                              {product.category}
                            </span>
                          </div>
                          <div className="mt-3 flex gap-2">
                            <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                              {translations.edit || 'Edit'}
                            </button>
                            <button className="flex-1 bg-gray-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-gray-700 transition-colors">
                              {translations.delete || 'Delete'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-gray-400 text-6xl mb-4">📦</div>
                      <h4 className="text-xl font-semibold text-gray-700 mb-2">
                        {translations.noProducts || 'No Products Yet'}
                      </h4>
                      <p className="text-gray-500 mb-6">
                        {translations.createFirstProduct || 'Create your first product to start showcasing your craftsmanship.'}
                      </p>
                      <button
                        onClick={() => setActiveTab('create')}
                        className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                      >
                        {translations.createFirstProductBtn || 'Create Your First Product'}
                      </button>
                    </div>
                  )}
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

export default ArtisanProfile;