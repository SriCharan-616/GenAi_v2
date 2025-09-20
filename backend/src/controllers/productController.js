import fs from "fs";
import path from "path";
import db from "../config/db.js"; // MySQL connection
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);


// Helper function to send image to Gemini and get enhanced image
const sendToGemini = async (imageBuffer) => {
  const base64Image = imageBuffer.toString("base64");
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-preview-image-generation", generationConfig: {
      responseModalities: ["TEXT", "IMAGE"], // 👈 ask for both
    }});

  const result = await model.generateContent([
    { text:  "Enhance this product image for e-commerce" },
    {
      inlineData: {
        data: base64Image,
        mimeType:  "image/jpeg",
      },
    },
  ]);

    const candidate = result.response.candidates[0];
    const parts = candidate.content.parts;

    let imgBase64 = null;
    let textOutput = null;

    for (const part of parts) {
      if (part.inlineData) {
        imgBase64 = part.inlineData.data; // this is base64 image string
      }
      if (part.text) {
        textOutput = part.text; // any descriptive text Gemini returns
      }
    }

    return imgBase64;
};

export const uploadProduct = async (req, res) => {
  try {
    const { name, description, price, category, story, seller_id } = req.body;
    const files = req.files; // multer memory storage gives us buffer

    if (!seller_id) return res.status(400).json({ message: "Seller ID is required" });
    if (!name || !price) return res.status(400).json({ message: "Product name and price are required" });

    // Insert product into 'products' table
    const [productResult] = await db.query(
      "INSERT INTO products (seller_id, name, description, price, stock) VALUES (?, ?, ?, ?, ?)",
      [seller_id, name, description || null, price, 0]
    );

    const productId = productResult.insertId;

    // Ensure uploads folder exists

    // Process each image
    for (const file of files) {
      // Use buffer directly (no fs.readFileSync)
    
      const enhancedBuffer = await sendToGemini(file.buffer);
      const buffer = Buffer.from(enhancedBuffer, "base64");
      // Save enhanced image to uploads folder
      const ext = path.extname(file.originalname) || ".jpg";
      const fileName = `${Date.now()}_${file.originalname}`;
      const savePath = path.join("/genai/backend/uploads", fileName);

      fs.writeFileSync(savePath, buffer);

      // Store image path in 'product_images' table
      await db.query(
        "INSERT INTO product_images (product_id, image_url) VALUES (?, ?)",
        [productId, savePath]
      );
    }

    res.json({ message: "Product uploaded and enhanced successfully", productId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
