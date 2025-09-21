// backend/src/controllers/productController.js
import fs from "fs";
import path from "path";
import { db, admin } from "../config/firebaseConfig.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Helper to send image to Gemini AI and get enhanced image
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
    const { name, description, price, category, story, seller_id } = req.body;
    const files = req.files;

    if (!seller_id) return res.status(400).json({ message: "Seller ID required" });
    if (!name || !price) return res.status(400).json({ message: "Name and price required" });

    // Verify seller exists
    const sellerDoc = await db.collection("sellers").where("userId", "==", seller_id).limit(1).get();
    if (sellerDoc.empty) return res.status(400).json({ message: "Seller not found" });

    // Create product
    const productRef = await db.collection("products").add({
      sellerId: seller_id,
      name,
      description: description || "",
      price: parseFloat(price),
      category: category || "",
      story: story || "",
      stock: 0,
      images: [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const productId = productRef.id;
    const imageUrls = [];

    if (files && files.length) {
      const uploadsDir = path.join(process.cwd(), "uploads");
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

      for (const file of files) {
        try {
          const enhancedBase64 = await sendToGemini(file.buffer);
          const buffer = Buffer.from(enhancedBase64, "base64");

          const ext = path.extname(file.originalname) || ".jpg";
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}${ext}`;
          const savePath = path.join(uploadsDir, fileName);

          fs.writeFileSync(savePath, buffer);
          imageUrls.push(`/uploads/${fileName}`);
        } catch (err) {
          console.error("Image enhancement error:", err);
        }
      }

      // Update product with images
      await productRef.update({
        images: imageUrls,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    res.json({ message: "Product uploaded successfully", productId, imageCount: imageUrls.length });
  } catch (err) {
    console.error("Upload product error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all products with optional filters
export const getProducts = async (req, res) => {
  try {
    const { category, sellerId, limit = 20, startAfter } = req.query;

    let query = db.collection("products");

    if (category) query = query.where("category", "==", category);
    if (sellerId) query = query.where("sellerId", "==", sellerId);

    query = query.limit(parseInt(limit));

    if (startAfter) {
      const startDoc = await db.collection("products").doc(startAfter).get();
      query = query.startAfter(startDoc);
    }

    query = query.orderBy("createdAt", "desc");

    const snapshot = await query.get();
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.json({ products });
  } catch (err) {
    console.error("Get products error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single product
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productDoc = await db.collection("products").doc(id).get();

    if (!productDoc.exists) return res.status(404).json({ message: "Product not found" });

    res.json({ product: { id: productDoc.id, ...productDoc.data() } });
  } catch (err) {
    console.error("Get product error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, story, stock } = req.body;

    const updateData = { updatedAt: admin.firestore.FieldValue.serverTimestamp() };
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (category !== undefined) updateData.category = category;
    if (story !== undefined) updateData.story = story;
    if (stock !== undefined) updateData.stock = parseInt(stock);

    await db.collection("products").doc(id).update(updateData);
    res.json({ message: "Product updated successfully" });
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productDoc = await db.collection("products").doc(id).get();

    if (!productDoc.exists) return res.status(404).json({ message: "Product not found" });

    const product = productDoc.data();

    // Delete images from disk
    if (product.images?.length) {
      const uploadsDir = path.join(process.cwd(), "uploads");
      product.images.forEach(imageUrl => {
        const filePath = path.join(uploadsDir, path.basename(imageUrl));
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
    }

    await db.collection("products").doc(id).delete();
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
