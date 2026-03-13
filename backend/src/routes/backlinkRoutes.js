import express from "express";
import {
  createBacklink,
  getBacklinks,
  getBacklink,
  updateBacklink,
  deleteBacklink,
} from "../controllers/backlinkController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createBacklink);

router.get("/brand/:brandId", protect, getBacklinks);

router.get("/:id", protect, getBacklink);

router.put("/:id", protect, updateBacklink);

router.delete("/:id", protect, deleteBacklink);

export default router;
