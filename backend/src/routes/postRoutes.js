import upload from "../middleware/uploadMiddleware.js";
import express from "express";
import {
  createPost,
  getPosts,
  getPost,
  deletePost,
  retryPost,
  reschedulePost,
  updatePost,
  togglePostStatus, // ✅ NEW
} from "../controllers/postController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* CREATE */
router.post("/", protect, upload.array("media"), createPost);

/* GET */
router.get("/brand/:brandId", protect, getPosts);
router.get("/:id", protect, getPost);

/* DELETE */
router.delete("/:id", protect, deletePost);

/* UPDATE */
router.put("/:id", protect, updatePost);

/* 🚀 TOGGLE STATUS (NEW) */
router.patch("/:id/toggle-status", protect, togglePostStatus);

/* EXISTING */
router.post("/:id/retry", protect, retryPost);
router.put("/:id/reschedule", protect, reschedulePost);

export default router;
