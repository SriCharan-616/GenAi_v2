import express from "express";
import { uploadImageMiddleware } from "../config/multerConfig.js";

const router = express.Router();

router.post("/upload", uploadImageMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "Image uploaded to Cloudinary!",
    fileUrl: req.file?.path || req.file?.secure_url
  });
});

export default router;
