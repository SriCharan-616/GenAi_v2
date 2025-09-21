import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { db, admin } from '../config/firebaseConfig.js';

dotenv.config();

// ------------------- REGISTER USER -------------------
export const registerUser = async (req, res) => {
  const { name, phone, email, password, businessName, businessLocation, seller } = req.body;

  if (!name || !phone || !password) {
    return res.status(400).json({ message: 'Name, phone, and password are required' });
  }

  if (seller === 'seller' && (!businessName || !businessLocation)) {
    return res.status(400).json({ message: 'Business name and location required for sellers' });
  }

  try {
    const usersRef = db.collection('users');

    // Check if user exists by email
    let existingUser = null;
    if (email) {
      const emailQuery = await usersRef.where('email', '==', email).limit(1).get();
      if (!emailQuery.empty) existingUser = emailQuery.docs[0];
    }

    // Check by phone if no existing user found
    if (!existingUser) {
      const phoneQuery = await usersRef.where('phone', '==', phone).limit(1).get();
      if (!phoneQuery.empty) existingUser = phoneQuery.docs[0];
    }

    if (existingUser) {
      return res.status(409).json({ message: 'User with this email or phone already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = seller === 'seller' ? 'seller' : 'customer';

    // Create user
    const userData = {
      name,
      email: email || '',
      phone,
      password: hashedPassword,
      role: userRole,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const userRef = await usersRef.add(userData);
    const userId = userRef.id;

    // If seller, create seller document
    if (seller === 'seller') {
      await db.collection('sellers').add({
        userId,
        businessName,
        businessLocation,
        socialLinks: '',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: userId, role: userRole, email: email || '' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: userId,
        name,
        email: email || '',
        phone,
        role: userRole,
        ...(seller === 'seller' && { businessName, businessLocation })
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ------------------- GET USER PROFILE -------------------
export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const userDoc = await db.collection('users').doc(id).get();

    if (!userDoc.exists) return res.status(404).json({ message: 'User not found' });

    const user = userDoc.data();
    const { password, ...userWithoutPassword } = user;
    const userId = userDoc.id;

    // Get seller details if user is a seller
    let sellerDetails = null;
    if (user.role === 'seller') {
      const sellerSnapshot = await db.collection('sellers').where('userId', '==', userId).limit(1).get();
      if (!sellerSnapshot.empty) sellerDetails = sellerSnapshot.docs[0].data();
    }

    res.json({
      user: {
        id: userId,
        ...userWithoutPassword,
        ...(sellerDetails && {
          businessName: sellerDetails.businessName,
          businessLocation: sellerDetails.businessLocation,
          socialLinks: sellerDetails.socialLinks
        })
      }
    });
  } catch (err) {
    console.error('Get user profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ------------------- UPDATE USER PROFILE -------------------
export const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, businessName, businessLocation, socialLinks } = req.body;

    const updateData = { updatedAt: admin.firestore.FieldValue.serverTimestamp() };
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;

    await db.collection('users').doc(id).update(updateData);

    // Update seller info if provided
    if (businessName !== undefined || businessLocation !== undefined || socialLinks !== undefined) {
      const sellerSnapshot = await db.collection('sellers').where('userId', '==', id).limit(1).get();
      if (!sellerSnapshot.empty) {
        const sellerDoc = sellerSnapshot.docs[0];
        const sellerUpdateData = { updatedAt: admin.firestore.FieldValue.serverTimestamp() };
        if (businessName !== undefined) sellerUpdateData.businessName = businessName;
        if (businessLocation !== undefined) sellerUpdateData.businessLocation = businessLocation;
        if (socialLinks !== undefined) sellerUpdateData.socialLinks = socialLinks;

        await sellerDoc.ref.update(sellerUpdateData);
      }
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Update user profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
