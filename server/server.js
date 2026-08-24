import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import scanRoutes from "./routes/scanRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

import connectDB from "./config/db.js";

dotenv.config();

const app = express();

// ==========================================
// CORS
// ==========================================

const allowedOrigins = [
  "http://localhost:5173",
  "https://ai-scam-shield-tny3.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without origin
      // and all Vercel deployments
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(express.json());

// ==========================================
// ROUTES
// ==========================================

app.use("/api/auth", authRoutes);

app.use("/api/scan", scanRoutes);

app.use("/api/chatbot", chatbotRoutes);

app.use("/api/reports", reportRoutes);

// ==========================================
// TEST ROUTE
// ==========================================

app.get("/", (req, res) => {
  res.send("AI Scam Shield Backend Running 🚀");
});

// ==========================================
// DATABASE
// ==========================================

connectDB();

// ==========================================
// SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});