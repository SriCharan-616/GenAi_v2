import { config } from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

config();

export const translateText = async (req, res) => {
  const availableLanguages = {
    'en': 'English', 'hi': 'हिन्दी', 'bn': 'বাংলা', 'te': 'తెలుగు',
    'mr': 'मराठी', 'ta': 'தமிழ்', 'gu': 'ગુજરાતી', 'ur': 'اردو',
    'kn': 'ಕನ್ನಡ', 'or': 'ଓଡ଼ିଆ', 'pa': 'ਪੰਜਾਬੀ', 'as': 'অসমীয়া',
    'ml': 'മലയാളം', 'fr': 'Français', 'es': 'Español', 'de': 'Deutsch',
    'it': 'Italiano', 'pt': 'Português', 'ru': 'Русский', 'ja': '日本語',
    'ko': '한국어', 'zh': '中文', 'ar': 'العربية'
  };


  const { lang, text } = req.body;

  if (!supportedLanguages[lang]) {
    return res.status(400).json({ error: "Unsupported language" });
  }

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const prompt = `
Translate the following JSON object to ${supportedLanguages[lang]}.
Return only a valid JSON object with the same keys but translated values:
${JSON.stringify(text, null, 2)}
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    let translations = {};
    try {
      const cleanText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      translations = JSON.parse(cleanText);
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      translations = { error: "AI returned non-JSON response", raw: responseText };
    }

    res.json(translations);
  } catch (err) {
    console.error("Translation error:", err);
    res.status(500).json({ error: "Failed to fetch translations", details: err.message });
  }
};
