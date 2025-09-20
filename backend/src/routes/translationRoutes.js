import express from 'express';
import TranslationController from '../controllers/TranslationController.js';

const router = express.Router();

// GET /api/languages - Get supported languages
router.get('/languages', TranslationController.getLanguages);

// POST /api/translations/:lang - Translate content to specific language
router.post('/translations/:lang', TranslationController.translate);

// Optional: Clear translation cache
router.delete('/cache', TranslationController.clearCache);

export default router;