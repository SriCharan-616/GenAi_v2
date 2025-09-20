import React, { useState, useEffect } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { useSpeech } from '../hooks/useSpeech';

import { LogIn, UserPlus, Volume2, ArrowRight, Heart, Eye, Share2, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TRANSLATION_KEYS } from '../constants/translationKeys';

import { LazyImage } from '../utils/lazyLoading';

import Navigation from '../components/common/Navigation';
import FloatingButtons from '../components/common/FloatingButtons';
import Button from '../components/ui/Button'; 
import Card from '../components/ui/Card';

const Homepage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('trending');
  const [currentReview, setCurrentReview] = useState(0);

  const {
    selectedLanguage,
    translations,
    languages,
    loading: translationsLoading,
    error: translationsError,
    changeLanguage
  } = useTranslations('en');

  const { speak, stop, isSpeaking, isSupported } = useSpeech(selectedLanguage);

  // Load saved login state
  useEffect(() => {
    const savedLoginState = localStorage.getItem('isLoggedIn');
    if (savedLoginState === 'true') setIsLoggedIn(true);
  }, []);

  // Save login state
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn.toString());
  }, [isLoggedIn]);

  // Handle translation errors
  useEffect(() => {
    if (translationsError) console.error('Translation error:', translationsError);
  }, [translationsError]);

  // Auto-rotate reviews
  const reviews = [
    { name: "Maria Rodriguez", rating: 5, text: "This platform transformed my small pottery business! Sales increased by 300%.", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612e6cd?w=60", location: "Mexico City" },
    { name: "James Chen", rating: 5, text: "The image enhancement feature is amazing. My products look professional now.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60", location: "San Francisco" },
    { name: "Priya Sharma", rating: 5, text: "Easy to use even for someone like me who's not tech-savvy. Wonderful!", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60", location: "Mumbai" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReview(prev => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Product data
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

  const sampleImages = [
    { before: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&q=50", after: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200", alt: "Handwoven basket enhancement" },
    { before: "https://images.unsplash.com/photo-1578749556568-bc2c40e68399?w=200&q=50", after: "https://images.unsplash.com/photo-1578749556568-bc2c40e68399?w=200", alt: "Ceramic vase enhancement" },
    { before: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&q=50", after: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200", alt: "Wooden bowl enhancement" }
  ];

  

  const navigate = useNavigate();

  const handleProductAction = (action, productId, productName) => {
    console.log(`${action} action for product ${productId}: ${productName}`);
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
      <main id="main-content">

        {/* Hero Section */}
        <section 
          className="relative overflow-hidden py-20 px-4 bg-gradient-to-br from-blue-50 via-white to-cyan-50"
          aria-labelledby="hero-title"
        >
          <div className="max-w-6xl mx-auto text-center relative z-10">
            <h1 
              id="hero-title"
              className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-cyan-600 to-sky-500 bg-clip-text text-transparent leading-tight"
            >
              {translations[TRANSLATION_KEYS.HERO_TITLE]}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              {translations[TRANSLATION_KEYS.HERO_SUBTITLE]}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg" icon={Volume2} onClick={() => speak(`${translations[TRANSLATION_KEYS.HERO_TITLE]}. ${translations[TRANSLATION_KEYS.HERO_SUBTITLE]}`)} disabled={isSpeaking} loading={isSpeaking} ariaLabel={isSpeaking ? 'Playing audio description' : 'Listen to page description'}>
                {translations[TRANSLATION_KEYS.HERO_LISTEN]}
              </Button>
              <Button variant="secondary" size="lg" onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })} ariaLabel="Scroll to products section">
                {translations[TRANSLATION_KEYS.COMMON_DISCOVER]}
              </Button>
            </div>
          </div>
        </section>

        {/* Auth Section */}
        {!isLoggedIn && (
          <section className="py-12 px-4 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border-y border-blue-200/50" aria-labelledby="auth-title">
            <div className="max-w-4xl mx-auto text-center">
              <h3 id="auth-title" className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
                {translations[TRANSLATION_KEYS.AUTH_SELL_BUY_CONTEXT]}
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button variant="secondary" size="lg" icon={LogIn} onClick={() => setIsLoggedIn(true)} ariaLabel="Sign in to your account">
                  {translations[TRANSLATION_KEYS.AUTH_SIGNIN]}
                </Button>
                <span className="text-gray-500 font-medium" aria-hidden="true">
                  {translations[TRANSLATION_KEYS.AUTH_OR]}
                </span>
                <Button variant="primary" size="lg" icon={UserPlus} onClick={() => navigate('/register')} ariaLabel="Create a new account">
                  {translations[TRANSLATION_KEYS.AUTH_REGISTER]}
                </Button>
              </div>
              <p className="mt-4 text-sm text-gray-600 max-w-2xl mx-auto">
                Join thousands of artisans and customers in our growing marketplace
              </p>
            </div>
          </section>
        )}

        {/* Intro Section */}
        <section id="intro-section" className="py-16 px-4 bg-white/70 backdrop-blur-sm" aria-labelledby="intro-title">
          <div className="max-w-6xl mx-auto text-center">
            <h2 id="intro-title" className="text-3xl md:text-4xl font-bold mb-8 text-gray-800">
              {translations[TRANSLATION_KEYS.INTRO_WHO_WE_ARE]}
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {translations[TRANSLATION_KEYS.INTRO_TEXT]}
            </p>
          </div>
        </section>

        {/* Product Display */}
        <section id="products-section" className="py-16 px-4 relative" aria-labelledby="products-title">
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="flex justify-center mb-12">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-blue-100">
                {tabs.map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 rounded-xl text-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${activeTab === tab ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`} aria-pressed={activeTab === tab} aria-label={`View ${translations[TRANSLATION_KEYS[`PRODUCTS_${tab.toUpperCase()}`]]} products`}>
                    {translations[TRANSLATION_KEYS[`PRODUCTS_${tab.toUpperCase()}`]]}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8" role="grid" aria-label="Product grid">
              {products[activeTab].map(product => (
                <Card key={product.id} className="overflow-hidden" padding={false}>
                  <div className="relative group">
                    <LazyImage src={product.image} alt={product.name} className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                        <button onClick={() => handleProductAction('like', product.id, product.name)} className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-red-500" aria-label={`Like ${product.name}`}>
                          <Heart className="w-5 h-5 text-red-500" aria-hidden="true" />
                        </button>
                        <button onClick={() => handleProductAction('view', product.id, product.name)} className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label={`View details for ${product.name}`}>
                          <Eye className="w-5 h-5 text-blue-600" aria-hidden="true" />
                        </button>
                        <button onClick={() => handleProductAction('share', product.id, product.name)} className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500" aria-label={`Share ${product.name}`}>
                          <Share2 className="w-5 h-5 text-cyan-600" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-2 text-gray-800">{product.name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-blue-600" role="text" aria-label={`Price: ${product.price}`}>{product.price}</span>
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
        </section>

        {/* Sample Images */}
        <section id="samples-section" className="py-16 px-4 bg-gradient-to-r from-blue-100/50 to-cyan-100/50 backdrop-blur-sm" aria-labelledby="samples-title">
          <div className="max-w-6xl mx-auto relative z-10">
            <h2 id="samples-title" className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
              {translations[TRANSLATION_KEYS.SAMPLE_TITLE]}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {sampleImages.map((sample, index) => (
                <Card key={index} className="p-6" role="img" aria-label={`${sample.alt} before and after comparison`}>
                  <div className="flex gap-4 items-center">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-2">{translations[TRANSLATION_KEYS.SAMPLE_BEFORE]}</p>
                      <LazyImage src={sample.before} alt={`${sample.alt} - before enhancement`} className="w-full h-32 object-cover rounded-xl"/>
                    </div>
                    <div className="flex flex-col items-center" aria-hidden="true">
                      <div className="w-8 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600"></div>
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full mt-1"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-2">{translations[TRANSLATION_KEYS.SAMPLE_AFTER]}</p>
                      <LazyImage src={sample.after} alt={`${sample.alt} - after enhancement`} className="w-full h-32 object-cover rounded-xl"/>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section id="reviews-section" className="py-16 px-4" aria-labelledby="reviews-title">
          <div className="max-w-4xl mx-auto relative z-10 text-center">
            <h2 id="reviews-title" className="text-3xl md:text-4xl font-bold mb-12 text-gray-800">
              {translations[TRANSLATION_KEYS.REVIEWS_TITLE]}
            </h2>
            <Card className="p-8 md:p-12 shadow-xl" hover={false}>
              <LazyImage src={reviews[currentReview].avatar} alt={`${reviews[currentReview].name} profile picture`} className="w-20 h-20 rounded-full mb-6 border-4 border-blue-200 mx-auto"/>
              <div className="flex justify-center mb-4">
                {[...Array(reviews[currentReview].rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" aria-hidden="true" />
                ))}
              </div>
              <blockquote className="text-xl text-gray-600 mb-6 italic leading-relaxed max-w-3xl mx-auto">
                "{reviews[currentReview].text}"
              </blockquote>
              <cite className="font-bold text-lg text-gray-800 not-italic">{reviews[currentReview].name}</cite>
              <p className="text-gray-500 text-sm mt-1">{reviews[currentReview].location}</p>
              <div className="flex justify-center mt-8 gap-2">
                {reviews.map((_, index) => (
                  <button key={index} onClick={() => setCurrentReview(index)} className={`w-3 h-3 rounded-full transition-all duration-200 ${index === currentReview ? 'bg-gradient-to-r from-blue-600 to-cyan-600' : 'bg-gray-300 hover:bg-gray-400'}`} aria-label={`View review from ${reviews[index].name}`}></button>
                ))}
              </div>
            </Card>
          </div>
        </section>

        {/* Explore More */}
        <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white relative overflow-hidden" aria-labelledby="explore-title">
          <div className="max-w-6xl mx-auto text-center relative z-10">
            <h2 id="explore-title" className="text-3xl md:text-4xl font-bold mb-8">{translations[TRANSLATION_KEYS.EXPLORE_TITLE]}</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">{translations[TRANSLATION_KEYS.EXPLORE_SUBTITLE]}</p>
            <Button variant="secondary" size="lg" onClick={() => console.log('Navigating to all products...')} className="bg-white text-blue-600 hover:bg-gray-100 border-0" icon={ArrowRight} iconPosition="right" ariaLabel="View all products in our marketplace">
              {translations[TRANSLATION_KEYS.EXPLORE_VIEW_ALL]}
            </Button>
          </div>
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full animate-pulse" aria-hidden="true"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full animate-bounce" aria-hidden="true"></div>
        </section>

      </main>

      <FloatingButtons speak={speak} translations={translations} isSpeaking={isSpeaking} isLoggedIn={isLoggedIn} />

      {!isSupported && (
        <div className="fixed bottom-4 left-4 bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-2 rounded-lg shadow-lg z-40" role="alert" aria-live="polite">
          Text-to-speech is not supported in your browser.
        </div>
      )}
    </div>
  );
};

export default Homepage;
