import express from 'express';
import {translateText} from '../controllers/TranslationController.js';

const router = express.Router();



// POST /api/translations/:lang - Translate content to specific language
router.post('/translate', translateText);


export default router;