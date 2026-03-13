import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getBrandAnalytics } from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/:brandId", protect, getBrandAnalytics);

export default router;
