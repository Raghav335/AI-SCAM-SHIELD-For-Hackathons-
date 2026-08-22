import express from "express";
import multer from "multer";

import {
  scanText,
  scanUrl,
  scanImage,
  scanEmail,
  scanWhatsApp,
  scanPayment,
  scanDeepfake,
  getScanHistory,
  getDashboardStats,
} from "../controllers/scanController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

// TEXT
router.post(
  "/text",
  authMiddleware,
  scanText
);

// URL
router.post(
  "/url",
  authMiddleware,
  scanUrl
);

// NORMAL IMAGE / OCR
router.post(
  "/image",
  authMiddleware,
  upload.single("image"),
  scanImage
);

// DEEPFAKE IMAGE
router.post(
  "/deepfake",
  authMiddleware,
  upload.single("image"),
  scanDeepfake
);

// EMAIL
router.post(
  "/email",
  authMiddleware,
  scanEmail
);

// WHATSAPP
router.post(
  "/whatsapp",
  authMiddleware,
  scanWhatsApp
);

// PAYMENT
router.post(
  "/payment",
  authMiddleware,
  upload.single("image"),
  scanPayment
);

// HISTORY
router.get(
  "/history",
  authMiddleware,
  getScanHistory
);

// DASHBOARD
router.get(
  "/dashboard",
  authMiddleware,
  getDashboardStats
);

// TEST
router.get(
  "/test",
  (req, res) => {
    res.json({
      message: "Scan route working",
    });
  }
);

export default router;