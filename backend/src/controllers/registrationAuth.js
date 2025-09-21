import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import pool from '../config/db.js';

dotenv.config();

// ------------------- REGISTER -------------------
export const registerUser = async (req, res) => {
  const { name, phone, email, password, businessName, businessLocation, seller } = req.body;

  if (!name || !phone || !password || !businessName || !businessLocation || !seller) {
    return res.status(400).json({ message: 'All required fields must be provided' });
  }

  try {
    // Check if user already exists by email or phone
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ? OR phone = ?',
      [email || '', phone]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: 'User with this email or phone already exists' });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Insert into users table
    const [result] = await pool.query(
      'INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      [name, email || null, phone, password_hash, seller === 'seller' ? 'seller' : 'customer']
    );

    const userId = result.insertId;

    // If seller, insert into sellers table
    if (seller === 'seller') {
      await pool.query(
        'INSERT INTO sellers (user_id, business_name, business_location) VALUES (?, ?, ?)',
        [userId, businessName, businessLocation]
      );
    }

    // Generate token
    const token = jwt.sign(
      { id: userId, role: seller === 'seller' ? 'seller' : 'customer', email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: userId,
        name,
        role: seller === 'seller' ? 'seller' : 'customer'
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};