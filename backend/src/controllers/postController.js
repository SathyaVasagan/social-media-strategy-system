import Post from "../models/Post.js";
import asyncHandler from "express-async-handler";

/* CREATE POST */

export const createPost = asyncHandler(async (req, res) => {
  const post = await Post.create(req.body);

  res.status(201).json(post);
});

/* GET POSTS BY BRAND */

export const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ brandId: req.params.brandId });

  res.json(posts);
});

/* GET SINGLE POST */

export const getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  res.json(post);
});

/* UPDATE POST */

export const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  Object.assign(post, req.body);

  const updated = await post.save();

  res.json(updated);
});

/* DELETE POST */

export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  await post.deleteOne();

  res.json({ message: "Post removed" });
});
