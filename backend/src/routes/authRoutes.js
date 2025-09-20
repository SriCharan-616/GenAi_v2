import express from 'express';
import { login } from '../controllers/Auth_Login.js';
import { registerUser } from "../controllers/registrationAuth.js";

const router = express.Router();

// POST /api/login
router.post("/register", registerUser);
router.post('/login', login);


export default router;
