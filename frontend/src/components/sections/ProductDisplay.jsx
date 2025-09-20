import React, { useState } from 'react';
import { Heart, Eye, Share2 } from 'lucide-react';
import { TRANSLATION_KEYS } from '../../constants/translationKeys';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { LazyImage } from '../../utils/lazyLoading';
import Card from '../ui/Card';
import Button from '../ui/Button';

const ProductDisplay = ({ translations }) => {
  const [activeTab, setActiveTab] = useState('trending');
  const { elementRef, hasBeenVisible } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });

  const products = {
    trending: [
      { id: 1, name: "Handwoven Basket", price: "$45", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300", likes: 124 },
      { id: 2, name: "Ceramic Vase", price: "$32", image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68399?w=300", likes: 89 },
      { id: 3, name: "Wooden Bowl", price: "$28", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300", likes: 156 }
    ],
    seasonal: [
      { id: 4, name: "Holiday Ornaments", price: "$15", image: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=300", likes: 203 },
      { id: 5, name: "Winter Scarf", price: "$38", image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=300", likes: 92 },
      { id: 6, name: "Candle Set", price: "$25", image: "https://images.unsplash.com/photo-1602874801006-10296707d777?w=300", likes: 167 }
    ],
    bestselling: [
      { id: 7, name: "Leather Bag", price: "$85", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300", likes: 298 },
      { id: 8, name: "Silver Jewelry", price: "$65", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300", likes: 234 },
      { id: 9, name: "Knitted Sweater", price: "$55", image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300", likes: 189 }
    ]
  };

  const tabs = ['trending', 'seasonal', 'bestselling'];

  const handleProductAction = (action, productId, productName) => {
    console.log(`${action} action for product ${productId}: ${productName}`);
    // In a real app, this would handle the actual action
  };

  return (
    <section 
      id="products-section" 
      ref={elementRef}
      className="py-16 px-4 relative"
      aria-labelledby="products-title"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        <div className={`transition-all duration-1000 delay-300 ${hasBeenVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-blue-100">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-xl text-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  aria-pressed={activeTab === tab}
                  aria-label={`View ${translations[TRANSLATION_KEYS[`PRODUCTS_${tab.toUpperCase()}`]]} products`}
                >
                  {translations[TRANSLATION_KEYS[`PRODUCTS_${tab.toUpperCase()}`]]}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" role="grid" aria-label="Product grid">
            {products[activeTab].map((product, index) => (
              <Card
                key={product.id}
                className="overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
                padding={false}
              >
                <div className="relative group">
                  <LazyImage 
                    src={product.image} 
                    alt={product.name}
                    placeholder="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTQ5NGE0Ij5Mb2FkaW5nLi4uPC90ZXh0Pjwvc3ZnPg=="
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                      <button 
                        onClick={() => handleProductAction('like', product.id, product.name)}
                        className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                        aria-label={`Like ${product.name}`}
                      >
                        <Heart className="w-5 h-5 text-red-500" aria-hidden="true" />
                      </button>
                      <button 
                        onClick={() => handleProductAction('view', product.id, product.name)}
                        className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label={`View details for ${product.name}`}
                      >
                        <Eye className="w-5 h-5 text-blue-600" aria-hidden="true" />
                      </button>
                      <button 
                        onClick={() => handleProductAction('share', product.id, product.name)}
                        className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        aria-label={`Share ${product.name}`}
                      >
                        <Share2 className="w-5 h-5 text-cyan-600" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2 text-gray-800">{product.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600" role="text" aria-label={`Price: ${product.price}`}>
                      {product.price}
                    </span>
                    <div className="flex items-center gap-1" role="text" aria-label={`${product.likes} likes`}>
                      <Heart className="w-4 h-4 text-red-500 fill-current" aria-hidden="true" />
                      <span className="text-gray-600">{product.likes}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
)};

export default ProductDisplay;