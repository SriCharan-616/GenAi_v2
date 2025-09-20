import { config } from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

config();

class TranslationController {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    // Initialize the model here
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    this.translationCache = new Map();

    this.supportedLanguages = {
      'en': 'English', 'hi': 'Hindi', 'bn': 'Bengali', 'te': 'Telugu',
      'mr': 'Marathi', 'ta': 'Tamil', 'gu': 'Gujarati', 'ur': 'Urdu',
      'kn': 'Kannada', 'or': 'Odia', 'pa': 'Punjabi', 'as': 'Assamese',
      'ml': 'Malayalam', 'fr': 'French', 'es': 'Spanish', 'de': 'German',
      'it': 'Italian', 'pt': 'Portuguese', 'ru': 'Russian', 'ja': 'Japanese',
      'ko': 'Korean', 'zh': 'Chinese', 'ar': 'Arabic'
    };
  }

  // GET /api/languages - Return array format that frontend expects
  getLanguages = (req, res) => {
    const languageArray = Object.entries(this.supportedLanguages).map(([code, name]) => ({
      code,
      name,
      flag: this.getLanguageFlag(code)
    }));
    res.json(languageArray);
  }

  // Helper method to get flag emojis
  getLanguageFlag = (code) => {
    const flags = {
      'en': '🇺🇸', 'hi': '🇮🇳', 'bn': '🇧🇩', 'te': '🇮🇳', 'mr': '🇮🇳',
      'ta': '🇮🇳', 'gu': '🇮🇳', 'ur': '🇵🇰', 'kn': '🇮🇳', 'or': '🇮🇳',
      'pa': '🇮🇳', 'as': '🇮🇳', 'ml': '🇮🇳', 'fr': '🇫🇷', 'es': '🇪🇸',
      'de': '🇩🇪', 'it': '🇮🇹', 'pt': '🇵🇹', 'ru': '🇷🇺', 'ja': '🇯🇵',
      'ko': '🇰🇷', 'zh': '🇨🇳', 'ar': '🇸🇦'
    };
    return flags[code] || '🌐';
  }

  // POST /api/translations/:lang
  translate = async (req, res) => {
    const { lang } = req.params;
    const { keys } = req.body;

    if (!this.supportedLanguages[lang]) {
      return res.status(400).json({ error: "Unsupported language" });
    }

    const cacheKey = `${lang}:${JSON.stringify(keys)}`;
    if (this.translationCache.has(cacheKey)) {
      return res.json(this.translationCache.get(cacheKey));
    }

    try {
      const prompt = `Translate the following JSON object keys and values to ${this.supportedLanguages[lang]}. Return only a valid JSON object with the same structure but translated values:\n\n${JSON.stringify(keys, null, 2)}`;

      // Use the correct method: generateContent instead of generateText
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const translatedText = response.text();

      let translations = {};
      try {
        // Clean the response text (remove any markdown formatting)
        const cleanText = translatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        translations = JSON.parse(cleanText);
      } catch (parseError) {
        console.error("JSON parsing error:", parseError);
        console.error("Raw response:", translatedText);
        translations = { error: "AI returned non-JSON response", raw: translatedText };
      }

      this.translationCache.set(cacheKey, translations);

      res.json(translations);
    } catch (err) {
      console.error("Translation error:", err);
      res.status(500).json({ error: "Failed to fetch translations", details: err.message });
    }
  }

  // Optional: Clear cache method
  clearCache = (req, res) => {
    this.translationCache.clear();
    res.json({ message: "Translation cache cleared" });
  }
}

export default new TranslationController();