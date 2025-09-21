// backend/src/controllers/authController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { db, admin } from '../config/firebaseConfig.js';

dotenv.config();

// Login controller
export const login = async (req, res) => {
  const { emailOrPhone, password } = req.body;

  if (!emailOrPhone || !password) {
    return res.status(400).json({ message: 'Email/Phone and password are required' });
  }

  try {
    const isEmail = emailOrPhone.includes('@');
    const usersRef = db.collection('users');

    // Query Firestore based on email or phone
    const snapshot = await usersRef
      .where(isEmail ? 'email' : 'phone', '==', emailOrPhone)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(401).json({ message: 'User not found' });
    }

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();
    const userId = userDoc.id;

    // Compare passwords
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Get seller details if applicable
    let sellerDetails = null;
    if (user.role === 'seller') {
      const sellersRef = db.collection('sellers');
      const sellerSnapshot = await sellersRef.where('userId', '==', userId).limit(1).get();

      if (!sellerSnapshot.empty) {
        sellerDetails = sellerSnapshot.docs[0].data();
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: userId, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        ...(sellerDetails && {
          businessName: sellerDetails.businessName,
          businessLocation: sellerDetails.businessLocation,
          socialLinks: sellerDetails.socialLinks
        })
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Firebase token verification middleware
export const verifyFirebaseToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
};
