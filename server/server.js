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

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ==========================================
// BODY PARSER
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
  res.status(200).send("AI Scam Shield Backend Running 🚀");
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