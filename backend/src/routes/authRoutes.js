import express from 'express';
import { login, verifyFirebaseToken } from '../controllers/Auth_Login.js';
import { 
  registerUser, 
  getUserProfile, 
  updateUserProfile 
} from "../controllers/registrationAuth.js";

const router = express.Router();

// Authentication routes
router.post("/register", registerUser);
router.post('/login', login);

// User profile routes (protected)
router.get('/profile/:id', getUserProfile);
router.put('/profile/:id', updateUserProfile);

// Optional: Add middleware to protect routes
// router.use(verifyFirebaseToken); // Uncomment to protect all routes below

export default router;