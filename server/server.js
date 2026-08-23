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

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/scan", scanRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use(
  "/api/chatbot",
  chatbotRoutes
);

app.use(
  "/api/reports",
  reportRoutes
);

app.get("/", (req, res) => {
  res.send("AI Scam Shield Backend Running 🚀");
});

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});