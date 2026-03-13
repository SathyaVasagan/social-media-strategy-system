import express from "express";
import {
  createCalendar,
  getCalendar,
  updateCalendar,
  deleteCalendar,
} from "../controllers/calendarController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createCalendar);

router.get("/:brandId", protect, getCalendar);

router.put("/:id", protect, updateCalendar);

router.delete("/:id", protect, deleteCalendar);

export default router;
