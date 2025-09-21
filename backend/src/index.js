import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import authRoutes from "./routes/authRoutes.js";
import productRoute from "./routes/productRoute.js";
import translationRoutes from "./routes/translationRoutes.js";

// Load environment variables
dotenv.config();

const app = express();

// Middleware: Allow requests from any origin
app.use(cors({
  origin: "*",       // <-- Accept requests from ANY origin
  credentials: true, // If you want to allow cookies, set to true (but "*" + credentials usually doesn't work together)
}));

app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files (for uploaded images)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running with Firebase',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', translationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔥 Using Firebase for database operations`);
});

export default app;
