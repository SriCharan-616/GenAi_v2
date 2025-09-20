import express from "express";
import { uploadAndTriggerZap } from "../config/multerConfig.js";

const router = express.Router();

router.post("/upload", uploadAndTriggerZap("image"), (req, res) => {
  res.json({
    success: true,
    message: "Image uploaded to Cloudinary and Zapier triggered!",
    fileUrl: req.file.path,
  });
});

export default router;
