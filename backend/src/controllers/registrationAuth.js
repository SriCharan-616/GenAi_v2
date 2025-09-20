import bcrypt from "bcrypt";
import db from "../config/db.js";

// Register new user
export const registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      role,
      businessName,
      businessType,
      location, // corresponds to business_location
      experience,
      interests
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !password || !role) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // Check if email already exists
    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Combine first and last name
    const fullName = `${firstName} ${lastName}`;

    // Insert into users table
    const [result] = await db.query(
      "INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)",
      [fullName, email, phone, hashedPassword, role]
    );

    // If role is seller, create seller profile
    if (role === "seller") {
      if (!businessName || !businessType || !location) {
        return res.status(400).json({ message: "Seller business information is required" });
      }

      await db.query(
        "INSERT INTO sellers (user_id, business_name, business_type, business_location) VALUES (?, ?, ?, ?)",
        [result.insertId, businessName, businessType, location]
      );

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
        // Return user data and token
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    });
    
    }


  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
