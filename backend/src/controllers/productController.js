// backend/src/controllers/productController.js
import fs from "fs";
import path from "path";
import { db, admin } from "../config/firebaseConfig.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Helper to enhance image via Gemini AI
const sendToGemini = async (imageBuffer) => {
  const base64Image = imageBuffer.toString("base64");
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-preview-image-generation",
    generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
  });

  const result = await model.generateContent([
    { text: "Enhance this product image for e-commerce" },
    {
      inlineData: { data: base64Image, mimeType: "image/jpeg" },
    },
  ]);

  const candidate = result.response.candidates[0];
  let imgBase64 = null;

  candidate.content.parts.forEach((part) => {
    if (part.inlineData) imgBase64 = part.inlineData.data;
  });

  return imgBase64;
};

// Upload a new product
export const uploadProduct = async (req, res) => {
  try {
    const { name, description, price, category, seller_id } = req.body;
    const files = req.files;

    if (!seller_id) return res.status(400).json({ message: "Seller ID required" });
    if (!name || !price) return res.status(400).json({ message: "Name and price required" });

    // Verify seller exists
    const sellerDoc = await db.collection("sellers").where("userId", "==", seller_id).limit(1).get();
    if (sellerDoc.empty) return res.status(400).json({ message: "Seller not found" });

    // Create product doc
    const productRef = await db.collection("products").add({
      sellerId: seller_id,
      name,
      description: description || "",
      price: parseFloat(price),
      category: category || "",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const productId = productRef.id;
    const uploadsDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    const imagePaths = [];

    // Store images locally and paths in product_images
    if (files && files.length) {
      for (const file of files) {
        try {
          // enhance image
          const enhancedBase64 = await sendToGemini(file.buffer);
          const buffer = Buffer.from(enhancedBase64, "base64");

          const ext = path.extname(file.originalname) || ".jpg";
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}${ext}`;
          const savePath = path.join(uploadsDir, fileName);

          fs.writeFileSync(savePath, buffer);
          const relativePath = `/uploads/${fileName}`;
          imagePaths.push(relativePath);

          // store image record separately
          await db.collection("product_images").add({
            productId,
            imagePath: relativePath,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        } catch (err) {
          console.error("Image enhancement error:", err);
        }
      }
    }

    res.json({
      message: "Product uploaded successfully",
      productId,
      imageCount: imagePaths.length,
      firstImage: imagePaths[0] || null,
    });
  } catch (err) {
    console.error("Upload product error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all products with their first image
export const getProducts = async (req, res) => {
  try {
    const { sellerId, limit = 20 } = req.query;

    let query = db.collection("products");
    if (sellerId) query = query.where("sellerId", "==", sellerId);
    query = query.limit(parseInt(limit));

    const snapshot = await query.get();
    const products = [];

    for (const doc of snapshot.docs) {
      const product = { id: doc.id, ...doc.data() };

      // get first image filename for this product
      const imgSnap = await db
        .collection("product_images")
        .where("productId", "==", doc.id)
        .limit(1)
        .get();

      if (!imgSnap.empty) {
        const filename = imgSnap.docs[0].data().imagePath;
        const filePath = path.join(process.cwd(), "uploads", filename); // correct path

        if (fs.existsSync(filePath)) {
          const buffer = fs.readFileSync(filePath);
          product.photo = `data:image/jpg;base64,${buffer.toString("base64")}`;
        } else {
          product.photo = null;
        }
      } else {
        product.photo = null;
      }

      products.push(product);
    }

    res.json({ products });
  } catch (err) {
    console.error("Get products error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
