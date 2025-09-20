import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinaryConfig.js";
import axios from "axios";

// Zapier webhook URL
const ZAPIER_WEBHOOK_URL = "https://hooks.zapier.com/hooks/catch/123456/abcde/";

// Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "your-app-images", // optional folder
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

// Trigger Zapier webhook
const triggerZapier = async (imageUrl, caption = "New image uploaded!") => {
  try {
    await axios.post(ZAPIER_WEBHOOK_URL, { imageUrl, caption });
    console.log("Zapier webhook triggered successfully!");
  } catch (err) {
    console.error("Failed to trigger Zapier:", err.message);
  }
};

// Middleware wrapper
export const uploadAndTriggerZap = (fieldName) => (req, res, next) => {
  upload.single(fieldName)(req, res, async (err) => {
    if (err) return res.status(400).json({ success: false, error: err.message });
    if (!req.file || !req.file.path)
      return res.status(400).json({ success: false, error: "No file uploaded" });

    // Trigger Zapier with Cloudinary URL
    await triggerZapier(req.file.path, req.body.caption);

    next();
  });
};
