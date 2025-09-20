import express from "express";
import { uploadProduct } from "../controllers/productController.js";
import upload from "../config/multerConfig.js";

const router = express.Router();

// Upload multiple images
router.post("/upload", upload.array("images", 10), uploadProduct); // max 10 images

export default router;
