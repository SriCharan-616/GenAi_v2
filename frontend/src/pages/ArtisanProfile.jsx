import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMyContext } from "../services/translationContext";
import Navigation from '../components/common/Navigation';

const ArtisanProfile = () => {
  
  const navigate = useNavigate();
  const { text } = useMyContext();

  const [artisanData, setArtisanData] = useState(null);
  const [activeTab, setActiveTab] = useState('create');

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    photos: [],        // will store File objects
    photoPreviews: [], // will store preview URLs
    price: '',
    category: ''
  });

  const [productErrors, setProductErrors] = useState({});
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);

  // Load artisan data
  useEffect(() => {
    const savedLoginState = localStorage.getItem('isLoggedIn');
    if (savedLoginState !== 'true') {
      navigate('/');
      return;
    }

    const savedArtisanData = localStorage.getItem('artisanData');
    if (savedArtisanData) {
      setArtisanData(JSON.parse(savedArtisanData));
    } else {
      const defaultArtisan = {
        id: '1',
        name: 'Artisan Name',
        products: []
      };
      setArtisanData(defaultArtisan);
      localStorage.setItem('artisanData', JSON.stringify(defaultArtisan));
    }
  }, []);

  const fetchArtisanData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      if (!user?.id) return;

      const res = await fetch('http://localhost:5000/api/artisan/${user.id}');
      if (!res.ok) throw new Error('Failed to fetch artisan data');

      const data = await res.json();
      setArtisanData(data);
      localStorage.setItem('artisanData', JSON.stringify(data));
    } catch (error) {
      console.error(error);
      navigate('/');
    }
  };

  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setProductForm(prev => ({ ...prev, [name]: value }));
    if (productErrors[name]) setProductErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        setProductErrors(prev => ({ ...prev, photo: text.photoTooLarge }));
        return;
      }
    }

    const previews = files.map(file => URL.createObjectURL(file));

    setProductForm(prev => ({
      ...prev,
      photos: [...prev.photos, ...files],
      photoPreviews: [...prev.photoPreviews, ...previews]
    }));

    if (productErrors.photo) setProductErrors(prev => ({ ...prev, photo: '' }));
  };

  const handleRemovePhoto = (index) => {
    setProductForm(prev => {
      const updatedPhotos = [...prev.photos];
      const updatedPreviews = [...prev.photoPreviews];
      updatedPhotos.splice(index, 1);
      updatedPreviews.splice(index, 1);
      return { ...prev, photos: updatedPhotos, photoPreviews: updatedPreviews };
    });
  };

  const validateProductForm = () => {
    const errors = {};
    if (!productForm.name.trim()) errors.name = text.productNameRequired;
    // Description is optional, only check min length if provided
    if (productForm.description && productForm.description.length < 20) {
      errors.description = text.descriptionTooShort;
    }
    if (productForm.photos.length === 0) errors.photo = text.photoRequired;
    if (!productForm.price || parseFloat(productForm.price) <= 0) errors.price = text.priceRequired;
    if (!productForm.category) errors.category = text.categoryRequired; // now mandatory
    return errors;
  };



  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const errors = validateProductForm();
    if (Object.keys(errors).length > 0) {
      setProductErrors(errors);
      return;
    }

    setIsSubmittingProduct(true);

    try {
      const formData = new FormData();
      formData.append('name', productForm.name);
      formData.append('description', productForm.description);
      formData.append('price', parseFloat(productForm.price));
      formData.append('category', productForm.category);
      productForm.photos.forEach(file => formData.append('photos', file));

      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      console.log(currentUser.id);
      formData.append('seller_id', currentUser.id);
      const response = await fetch('http://localhost:5000/api/products/uploadprod', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Failed to create product');

      const savedProduct = await response.json();

      const updatedArtisanData = {
        ...artisanData,
        products: [...(artisanData.products || []), savedProduct]
      };

      setArtisanData(updatedArtisanData);
      localStorage.setItem('artisanData', JSON.stringify(updatedArtisanData));

      setProductForm({
        name: '',
        description: '',
        photos: [],
        photoPreviews: [],
        price: '',
        category: ''
      });
      setActiveTab('products');
    } catch (error) {
      console.error('Product creation error:', error);
      setProductErrors({ submit: text.productCreationError || 'Failed to create product.' });
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  if (!artisanData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">{text.loadingArtisanData}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 relative">
      <Navigation />

      <main id="main-content" className="pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {text.welcome}, {artisanData.name}!
            </h1>
            <p className="text-xl text-gray-600">{text.artisanDashboard}</p>
          </div>

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
                  {text.createNewProduct}
                </button>
                <button
                  onClick={() => setActiveTab('products')}
                  className={`py-4 px-6 text-sm font-semibold transition-colors ${
                    activeTab === 'products'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {text.myProducts} ({artisanData.products?.length || 0})
                </button>
              </nav>
            </div>

            <div className="p-6 md:p-8">
              {activeTab === 'create' && (
                <form onSubmit={handleProductSubmit} className="space-y-6">
                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {text.productName} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={productForm.name}
                      onChange={handleProductInputChange}
                      placeholder={text.enterProductName}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                        productErrors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {productErrors.name && <p className="mt-2 text-sm text-red-600">{productErrors.name}</p>}
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {text.category}  <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={productForm.category}
                      onChange={handleProductInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                        productErrors.category ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      {text.selectCategory.map((key) => (
                        <option key={key} value={key}>
                          {key}
                        </option>
                      ))}
                    </select>
                    {productErrors.category && <p className="mt-2 text-sm text-red-600">{productErrors.category}</p>}
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {text.price} <span className="text-red-500">*</span>
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
                          productErrors.price ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {productErrors.price && <p className="mt-2 text-sm text-red-600">{productErrors.price}</p>}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {text.description} 
                    </label>
                    <textarea
                      name="description"
                      value={productForm.description}
                      onChange={handleProductInputChange}
                      rows={4}
                      placeholder={text.enterDescription}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                        productErrors.description ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {productErrors.description && <p className="mt-2 text-sm text-red-600">{productErrors.description}</p>}
                  </div>

                  {/* Photos */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {text.photoRequired} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoChange}
                      className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {productErrors.photo && (
                      <p className="mt-2 text-sm text-red-600">{productErrors.photo}</p>
                    )}

                    {productForm.photoPreviews.length > 0 && (
                      <div className="flex flex-wrap gap-4 mt-4">
                        {productForm.photoPreviews.map((preview, idx) => (
                          <div key={idx} className="relative group">
                            <img
                              src={preview}
                              alt={`preview-${idx}`}

                              className="w-32 h-32 object-cover rounded-xl border border-gray-200 shadow-sm"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(idx)}
                              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-80 hover:opacity-100 shadow-md"
                              title="Remove"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingProduct}
                    className="w-full py-4 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg"
                  >
                    {isSubmittingProduct ? text.creatingProduct : text.createProduct}
                  </button>
                </form>
              )}

              {activeTab === 'products' && (
                <div>
                  {artisanData.products?.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {artisanData.products.map((product) => (
                        <div key={product.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                          <img src={product.photo} alt={product.name} className="w-full h-48 object-cover rounded-xl mb-2" />
                          <h4 className="font-semibold text-gray-900">{product.name}</h4>
                          <p className="text-gray-600 text-sm">{product.description}</p>
                          <span className="text-blue-600 font-bold">₹{product.price}</span>
                          <div className="mt-2 flex gap-2">
                            <button className="bg-blue-600 text-white px-2 py-1 rounded">{text.edit}</button>
                            <button className="bg-gray-600 text-white px-2 py-1 rounded">{text.delete}</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <h4 className="text-xl font-semibold text-gray-700">{text.noProducts}</h4>
                      <p className="text-gray-500 mb-6">{text.createFirstProduct}</p>
                      <button className="bg-blue-600 text-white px-6 py-3 rounded-xl">{text.createFirstProductBtn}</button>
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