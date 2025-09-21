import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinaryConfig.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "your-app-images",
    allowed_formats: ["jpg","jpeg","png","webp"]
  },
});

const upload = multer({ storage });

// Middleware for uploading image only
export const uploadImageMiddleware = upload.single("image");