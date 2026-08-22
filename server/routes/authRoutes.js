import express from "express";
import {
  signup,
  login,
  getProfile,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Signup API
router.post("/signup", signup);

// Login API
router.post("/login", login);

// Protected Profile API
router.get("/profile", authMiddleware, getProfile);

export default router;