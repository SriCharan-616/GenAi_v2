import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import productRoute from "./routes/productRoute.js";
import translationRoutes from "./routes/translationRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', translationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoute);

export default app;
