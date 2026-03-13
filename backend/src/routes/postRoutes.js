import express from "express";
import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
} from "../controllers/postController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createPost);

router.get("/brand/:brandId", protect, getPosts);

router.get("/:id", protect, getPost);

router.put("/:id", protect, updatePost);

router.delete("/:id", protect, deletePost);

export default router;
