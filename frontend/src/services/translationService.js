class TranslationError extends Error {
  constructor(message, languageCode) {
    super(message);
    this.name = 'TranslationError';
    this.languageCode = languageCode;
  }
}

// Default fallback translations
const DEFAULT_TRANSLATIONS = {
  'nav.home': 'Home',
  'nav.explore': 'Explore Products', 
  'nav.about': 'About Us',
  'nav.contact': 'Contact',
  'nav.signin': 'Sign In',
  'nav.register': 'Register',
  'nav.myProfile': 'My Profile',
  'hero.title': 'Empower Your Craft',
  'hero.subtitle': 'Upload, enhance, and share your beautiful creations with the world',
  'hero.listen': 'Listen to Introduction',
  'intro.whoWeAre': 'Who We Are',
  'intro.text': 'We help artisans showcase their beautiful handmade products with enhanced images and easy social media sharing. Join thousands of creators growing their business with us.',
  'products.trending': 'Trending',
  'products.seasonal': 'Seasonal', 
  'products.bestselling': 'Bestselling',
  'sample.title': 'Sample Enhanced Images',
  'sample.before': 'Before',
  'sample.after': 'After',
  'reviews.title': 'What Our Artisans Say',
  'auth.sellBuyContext': 'Want to sell your crafts or buy unique items?',
  'auth.signin': 'Sign In',
  'auth.register': 'Register',
  'auth.or': 'or',
  'explore.title': 'Explore More Products',
  'explore.subtitle': 'Discover thousands of unique handmade products',
  'explore.viewAll': 'View All',
  'common.listen': 'Listen',
  'common.discover': 'Discover More',
  'error.translationFetch': 'Unable to load translations. Using default language.',
  'error.speechNotSupported': 'Text-to-speech is not supported in your browser.',
  'error.generic': 'Something went wrong. Please try again.'
};

class TranslationService {
  constructor() {
    this.cache = new Map();
    this.baseURL =  'http://localhost:3001/api';
  }

  async fetchTranslations(languageCode, retries = 3) {
    // Check cache first
    if (this.cache.has(languageCode)) {
      return this.cache.get(languageCode);
    }

    let lastError;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

        const response = await fetch(`${this.baseURL}/translations/${languageCode}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new TranslationError(
            `HTTP ${response.status}: ${response.statusText}`,
            languageCode
          );
        }

        const translations = await response.json();
        
        // Validate response structure
        if (!translations || typeof translations !== 'object') {
          throw new TranslationError('Invalid translation data received', languageCode);
        }

        // Merge with defaults to ensure all keys exist
        const mergedTranslations = { ...DEFAULT_TRANSLATIONS, ...translations };
        
        // Cache the result
        this.cache.set(languageCode, mergedTranslations);
        
        return mergedTranslations;

      } catch (error) {
        lastError = error;
        
        if (error.name === 'AbortError') {
          console.warn(`Translation request timeout for ${languageCode} (attempt ${attempt})`);
        } else if (error instanceof TranslationError) {
          console.error(`Translation fetch error for ${languageCode}:`, error.message);
        } else {
          console.error(`Network error fetching translations for ${languageCode}:`, error.message);
        }

        // If this is the last attempt, break
        if (attempt === retries) break;
        
        // Exponential backoff: wait before retry
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }

    // If all attempts failed, return default translations
    console.warn(`Failed to fetch translations for ${languageCode} after ${retries} attempts. Using defaults.`);
    
    // Still cache the defaults to avoid repeated failed requests
    this.cache.set(languageCode, DEFAULT_TRANSLATIONS);
    
    return DEFAULT_TRANSLATIONS;
  }

  // Get available languages from backend
  async getAvailableLanguages() {
    try {
      const response = await fetch(`${this.baseURL}/languages`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch available languages:', error);
      
      // Return default languages
      return [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'es', name: 'Español', flag: '🇪🇸' },
        { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
        { code: 'ar', name: 'العربية', flag: '🇸🇦' }
      ];
    }
  }

  // Clear cache if needed
  clearCache(languageCode = null) {
    if (languageCode) {
      this.cache.delete(languageCode);
    } else {
      this.cache.clear();
    }
  }
}

export default new TranslationService();