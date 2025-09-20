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
  'review1':'This platform transformed my small pottery business! Sales increased by 300%.',
  'review2':'The image enhancement feature is amazing. My products look professional now.',
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
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    this.availableLanguagesCache = null;
  }

  async fetchTranslations(languageCode, retries = 3) {
    // Return defaults for English to avoid unnecessary API calls
    if (languageCode === 'en') {
      return DEFAULT_TRANSLATIONS;
    }

    // Check cache first
    if (this.cache.has(languageCode)) {
      return this.cache.get(languageCode);
    }

    let lastError;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // Increased to 10s

        const response = await fetch(`${this.baseURL}/translations/${languageCode}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ keys: DEFAULT_TRANSLATIONS }),
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

        // Check if AI returned an error
        if (translations.error) {
          throw new TranslationError(translations.error, languageCode);
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
    // Return cached result if available
    if (this.availableLanguagesCache) {
      return this.availableLanguagesCache;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${this.baseURL}/languages`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const languages = await response.json();
      
      // Validate that we received an array
      if (!Array.isArray(languages)) {
        throw new Error('Invalid language data format received');
      }

      // Cache the result
      this.availableLanguagesCache = languages;
      
      return languages;

    } catch (error) {
      console.error('Failed to fetch available languages:', error);
      
      // Return default languages as fallback
      const fallbackLanguages = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'es', name: 'Español', flag: '🇪🇸' },
        { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
        { code: 'ar', name: 'العربية', flag: '🇸🇦' }
      ];

      this.availableLanguagesCache = fallbackLanguages;
      return fallbackLanguages;
    }
  }

  // Clear cache if needed
  clearCache(languageCode = null) {
    if (languageCode) {
      this.cache.delete(languageCode);
    } else {
      this.cache.clear();
      this.availableLanguagesCache = null;
    }
  }

  // Preload translations for commonly used languages
  async preloadTranslations(languageCodes = ['es', 'hi', 'fr']) {
    const promises = languageCodes.map(code => 
      this.fetchTranslations(code).catch(err => 
        console.warn(`Failed to preload ${code}:`, err.message)
      )
    );
    
    await Promise.all(promises);
  }
}

export default new TranslationService();