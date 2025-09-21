import express from "express";
import { uploadProduct } from "../controllers/productController.js";
import upload from "../config/multerConfig1.js";
import { uploadImageMiddleware } from "../config/multerConfig.js";

const router = express.Router();

router.post("/upload", uploadImageMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "Image uploaded to Cloudinary!",
    fileUrl: req.file?.path || req.file?.secure_url
  });
});

// Upload multiple images
router.post("/uploadprod", upload.array("images", 10), uploadProduct); // max 10 images

export default router;
