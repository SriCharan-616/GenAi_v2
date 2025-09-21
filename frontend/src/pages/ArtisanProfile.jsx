import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMyContext } from "../services/translationContext";
import Navigation from '../components/common/Navigation';

const ArtisanProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { text } = useMyContext();

  const [artisanData, setArtisanData] = useState(null);
  const [activeTab, setActiveTab] = useState('create');
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [authChecked, setAuthChecked] = useState(false); // Add this state

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    images: [],
    imagePreviews: [],
    price: '',
    category: '',
    story: ''
  });
  const [productErrors, setProductErrors] = useState({});
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);

  // Get API URL from Vite environment variables
  const API_URL = 'http://localhost:5000';

  // Authentication check and data loading - FIX: Add proper dependencies and prevent infinite loop
  useEffect(() => {
    // Only run if we haven't checked auth yet
    if (authChecked) return;

    const token = localStorage.getItem('token');
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (!token || isLoggedIn !== 'true') {
      setAuthChecked(true);
      navigate('/login', { state: { from: location }, replace: true });
      return;
    }

    // Load user data
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      try {
        const userData = JSON.parse(currentUser);
        setArtisanData(userData);
        
        // Load products for this seller
        if (userData.role === 'seller') {
          fetchProducts(userData.id);
        }
        setAuthChecked(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setAuthChecked(true);
        navigate('/login', { replace: true });
      }
    } else {
      // If no user data, redirect to login
      setAuthChecked(true);
      navigate('/login', { replace: true });
    }
  }, [authChecked, navigate, location]); // Add proper dependencies

  // Display success/welcome message
  useEffect(() => {
    if (location.state?.message) {
      console.log('Welcome message:', location.state.message);
      // Could show toast notification here
    }
  }, [location.state]);

  // Fetch products for the seller
  const fetchProducts = async (sellerId) => {
    try {
      setIsLoadingProducts(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/products/products?sellerId=${sellerId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        setProducts(result.products || []);
      } else {
        console.error('Failed to fetch products');
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setProductForm(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user starts typing
    if (productErrors[name]) {
      setProductErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (productErrors.submit) {
      setProductErrors(prev => ({ ...prev, submit: '' }));
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    // Validate file sizes and types
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    
    const invalidFiles = files.filter(file => 
      file.size > maxSize || !validTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      setProductErrors(prev => ({
        ...prev,
        images: text.invalidImageFiles || 'Some files are too large or invalid format (max 5MB, JPEG/PNG/WebP only)'
      }));
      return;
    }

    // Limit to maximum 10 images
    const selectedFiles = files.slice(0, 10);

    // Create previews
    const previews = [];
    let loadedCount = 0;

    selectedFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        previews[index] = e.target.result;
        loadedCount++;
        
        if (loadedCount === selectedFiles.length) {
          setProductForm(prev => ({
            ...prev,
            images: selectedFiles,
            imagePreviews: previews
          }));
        }
      };
      reader.readAsDataURL(file);
    });

    // Clear image errors
    if (productErrors.images) {
      setProductErrors(prev => ({ ...prev, images: '' }));
    }
  };

  const removeImage = (index) => {
    setProductForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imagePreviews: prev.imagePreviews.filter((_, i) => i !== index)
    }));
  };

  const validateProductForm = () => {
    const errors = {};
    
    if (!productForm.name.trim()) {
      errors.name = text.productNameRequired || 'Product name is required';
    }
    
    if (!productForm.description.trim()) {
      errors.description = text.descriptionRequired || 'Description is required';
    } else if (productForm.description.length < 20) {
      errors.description = text.descriptionTooShort || 'Description must be at least 20 characters';
    }
    
    if (productForm.images.length === 0) {
      errors.images = text.imagesRequired || 'At least one product image is required';
    }
    
    if (!productForm.price || parseFloat(productForm.price) <= 0) {
      errors.price = text.priceRequired || 'Valid price is required';
    }
    
    if (!productForm.category.trim()) {
      errors.category = text.categoryRequired || 'Category is required';
    }
    
    return errors;
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateProductForm();
    if (Object.keys(errors).length > 0) {
      setProductErrors(errors);
      return;
    }

    if (!artisanData?.id) {
      setProductErrors({ submit: 'User authentication error. Please login again.' });
      return;
    }

    setIsSubmittingProduct(true);
    setProductErrors({});

    try {
      const token = localStorage.getItem('token');
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('name', productForm.name);
      formData.append('description', productForm.description);
      formData.append('price', productForm.price);
      formData.append('category', productForm.category);
      formData.append('story', productForm.story);
      formData.append('seller_id', artisanData.id);

      // Append images
      productForm.images.forEach((image) => {
        formData.append('images', image);
      });

      const response = await fetch(`http://localhost:5000/api/products/uploadprod`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type for FormData, browser will set it with boundary
        },
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create product');
      }

      console.log('Product created successfully:', result);

      // Reset form
      setProductForm({
        name: '',
        description: '',
        images: [],
        imagePreviews: [],
        price: '',
        category: '',
        story: ''
      });

      // Refresh products list
      await fetchProducts(artisanData.id);

      // Switch to products tab to show the new product
      setActiveTab('products');

      // Show success message (could be a toast notification)
      alert(text.productCreatedSuccess || 'Product created successfully!');

    } catch (error) {
      console.error('Product creation error:', error);
      setProductErrors({ 
        submit: error.message || text.productCreationError || 'Failed to create product. Please try again.' 
      });
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm(text.confirmDelete || 'Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/products/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Remove from local state
        setProducts(prev => prev.filter(p => p.id !== productId));
        alert(text.productDeleted || 'Product deleted successfully');
      } else {
        const result = await response.json();
        alert(result.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert(text.deleteError || 'Failed to delete product');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('artisanData');
    navigate('/login');
  };

  // Categories list
  const categories = [
    'Handicrafts',
    'Textiles',
    'Pottery',
    'Jewelry',
    'Wood Work',
    'Metal Craft',
    'Paintings',
    'Sculptures',
    'Traditional Arts',
    'Home Decor'
  ];

  // Show loading while checking authentication
  if (!authChecked || !artisanData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">{text.loadingArtisanData || 'Loading your profile...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 relative">
      <Navigation />

      <main id="main-content" className="pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header with welcome message */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {text.welcome || 'Welcome'}, {artisanData.name}!
            </h1>
            <p className="text-xl text-gray-600">{text.artisanDashboard || 'Artisan Dashboard'}</p>
            
            {location.state?.message && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4 max-w-md mx-auto">
                <p className="text-green-600 font-medium">{location.state.message}</p>
              </div>
            )}
          </div>

          {/* Profile Info Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{artisanData.name}</h3>
                <p className="text-gray-600">{artisanData.email}</p>
                <p className="text-gray-600">{artisanData.phone}</p>
                {artisanData.businessName && (
                  <>
                    <p className="text-blue-600 font-medium mt-2">{artisanData.businessName}</p>
                    <p className="text-gray-500">{artisanData.businessLocation}</p>
                  </>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-100 text-red-700 px-4 py-2 rounded-xl font-medium hover:bg-red-200 transition-colors"
              >
                {text.logout || 'Logout'}
              </button>
            </div>
          </div>

          {/* Main Dashboard */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            
            {/* Tab Navigation */}
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
                  {text.createNewProduct || 'Create New Product'}
                </button>
                <button
                  onClick={() => setActiveTab('products')}
                  className={`py-4 px-6 text-sm font-semibold transition-colors ${
                    activeTab === 'products' 
                      ? 'border-b-2 border-blue-500 text-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {text.myProducts || 'My Products'} ({products.length})
                </button>
              </nav>
            </div>

            <div className="p-6 md:p-8">
              
              {/* Create Product Tab */}
              {activeTab === 'create' && (
                <form onSubmit={handleProductSubmit} className="space-y-6">
                  
                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {text.productName || 'Product Name'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={productForm.name}
                      onChange={handleProductInputChange}
                      placeholder={text.enterProductName || 'Enter product name'}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                        productErrors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      disabled={isSubmittingProduct}
                    />
                    {productErrors.name && (
                      <p className="mt-2 text-sm text-red-600">{productErrors.name}</p>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {text.category || 'Category'} <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={productForm.category}
                      onChange={handleProductInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                        productErrors.category ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      disabled={isSubmittingProduct}
                    >
                      <option value="">{text.selectCategory || 'Select a category'}</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {productErrors.category && (
                      <p className="mt-2 text-sm text-red-600">{productErrors.category}</p>
                    )}
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {text.price || 'Price'} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-gray-500">₹</span>
                      <input
                        type="number"
                        name="price"
                        value={productForm.price}
                        onChange={handleProductInputChange}
                        min="1"
                        step="0.01"
                        placeholder="0.00"
                        className={`w-full pl-8 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                          productErrors.price ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        disabled={isSubmittingProduct}
                      />
                    </div>
                    {productErrors.price && (
                      <p className="mt-2 text-sm text-red-600">{productErrors.price}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {text.description || 'Description'} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={productForm.description}
                      onChange={handleProductInputChange}
                      rows={4}
                      placeholder={text.enterDescription || 'Describe your product (minimum 20 characters)'}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                        productErrors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      disabled={isSubmittingProduct}
                    />
                    <p className="text-sm text-gray-500 mt-1">{productForm.description.length}/20 characters minimum</p>
                    {productErrors.description && (
                      <p className="mt-2 text-sm text-red-600">{productErrors.description}</p>
                    )}
                  </div>

                  {/* Story (Optional) */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {text.artisanStory || 'Artisan Story'} 
                      <span className="text-gray-500 text-xs ml-2">({text.optional || 'optional'})</span>
                    </label>
                    <textarea
                      name="story"
                      value={productForm.story}
                      onChange={handleProductInputChange}
                      rows={3}
                      placeholder={text.enterStory || 'Share the story behind your craft...'}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                      disabled={isSubmittingProduct}
                    />
                  </div>

                  {/* Product Images */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {text.productImages || 'Product Images'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImagesChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                        productErrors.images ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      disabled={isSubmittingProduct}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Upload up to 10 images (JPEG, PNG, WebP - max 5MB each)
                    </p>
                    {productErrors.images && (
                      <p className="mt-2 text-sm text-red-600">{productErrors.images}</p>
                    )}
                    
                    {/* Image Previews */}
                    {productForm.imagePreviews.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {productForm.imagePreviews.map((preview, index) => (
                          <div key={index} className="relative">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-xl border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                              disabled={isSubmittingProduct}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submit Error */}
                  {productErrors.submit && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="text-sm text-red-600 font-medium">{productErrors.submit}</p>
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
                        {text.creatingProduct || 'Creating Product...'}
                      </div>
                    ) : (
                      text.createProduct || 'Create Product'
                    )}
                  </button>
                </form>
              )}

              {/* Products Tab */}
              {activeTab === 'products' && (
                <div>
                  {isLoadingProducts ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">{text.loadingProducts || 'Loading products...'}</p>
                    </div>
                  ) : products.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {products.map(product => (
                        <div key={product.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                          {/* Product Image */}
                          {product.images && product.images.length > 0 && (
                            <img
                              src={`${API_URL}${product.images[0]}`}
                              alt={product.name}
                              className="w-full h-48 object-cover rounded-xl mb-4"
                              onError={(e) => {
                                e.target.src = '/placeholder-image.jpg'; // Fallback image
                              }}
                            />
                          )}
                          
                          <h4 className="font-semibold text-gray-900 mb-2">{product.name}</h4>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                          <p className="text-blue-600 font-bold text-lg mb-2">₹{product.price}</p>
                          <p className="text-gray-500 text-xs mb-3">{product.category}</p>
                          
                          <div className="flex gap-2">
                            <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                              {text.edit || 'Edit'}
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
                            >
                              {text.delete || 'Delete'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📦</div>
                      <h4 className="text-xl font-semibold text-gray-700 mb-2">
                        {text.noProducts || 'No Products Yet'}
                      </h4>
                      <p className="text-gray-500 mb-6">
                        {text.createFirstProduct || 'Create your first product to start selling'}
                      </p>
                      <button
                        onClick={() => setActiveTab('create')}
                        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                      >
                        {text.createFirstProductBtn || 'Create Your First Product'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ArtisanProfile;