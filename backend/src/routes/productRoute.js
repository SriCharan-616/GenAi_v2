import express from "express";
import { 
  uploadProduct, 
  getProducts, 
} from "../controllers/productController.js";
import upload from "../config/multerConfig1.js";
import { uploadImageMiddleware } from "../config/multerConfig.js";

const router = express.Router();

// Single image upload to Cloudinary
router.post("/upload", uploadImageMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "Image uploaded to Cloudinary!",
    fileUrl: req.file?.path || req.file?.secure_url
  });
});

// Product CRUD operations
router.post("/uploadprod", upload.array("photos", 10), uploadProduct); // Create product with images
router.get("/products", getProducts); // Get all products with filtering/pagination


// Alternative route structure (if you prefer RESTful naming)
// router.get("/", getProducts);
// router.get("/:id", getProduct);  
// router.post("/", upload.array("images", 10), uploadProduct);
// router.put("/:id", updateProduct);
// router.delete("/:id", deleteProduct);

export default router;