import express from "express";

import {
  createReport,
  getMyReports,
} from "../controllers/reportController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  createReport
);

router.get(
  "/my",
  authMiddleware,
  getMyReports
);

export default router;