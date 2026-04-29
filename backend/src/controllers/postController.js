import axios from "axios";
import Brand from "../models/Brand.js";
import Post from "../models/Post.js";
import asyncHandler from "express-async-handler";
import getCloudinary from "../utils/cloudinary.js";
import { postQueue } from "../jobs/postQueue.js";

/* HELPER */

const uploadToCloudinary = (fileBuffer) => {
  const cloudinary = getCloudinary();

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      },
    );

    stream.end(fileBuffer);
  });
};

/* CREATE POST */

export const createPost = asyncHandler(async (req, res) => {
  const { brandId, title, postType, platform, caption, scheduledAt } = req.body;

  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error("Media is required");
  }

  const scheduledDate = new Date(scheduledAt);
  if (scheduledDate <= new Date()) {
    res.status(400);
    throw new Error("Scheduled time must be in the future");
  }

  const post = await Post.create({
    brandId,
    title,
    postType,
    platform,
    caption,
    scheduledAt: scheduledDate,
    status: "Processing",
  });

  setImmediate(async () => {
    try {
      const uploadedUrls = await Promise.all(
        req.files.map((file) => uploadToCloudinary(file.buffer)),
      );

      const updatedPost = await Post.findByIdAndUpdate(
        post._id,
        { mediaUrls: uploadedUrls, status: "Scheduled" },
        { new: true },
      );

      const delay = new Date(updatedPost.scheduledAt).getTime() - Date.now();

      if (delay <= 0) return;

      const job = await postQueue.add(
        "publish-post",
        { postId: updatedPost._id },
        {
          delay,
          attempts: 3,
          backoff: { type: "exponential", delay: 5000 },
        },
      );

      updatedPost.jobId = job.id;
      await updatedPost.save();

      console.log("✅ Job scheduled:", job.id);
    } catch (err) {
      await Post.findByIdAndUpdate(post._id, {
        status: "Failed",
        errorMessage: err.message,
      });
    }
  });

  res.status(201).json(post);
});

/* 🔥 UPDATE POST (LOCKED FOR POSTED) */

export const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new Error("Post not found");

  if (post.status === "Posted") {
    res.status(400);
    throw new Error("Posted posts cannot be edited");
  }

  const { title, postType, platform, caption, scheduledAt, status } = req.body;

  // Remove old job
  if (post.jobId) {
    const oldJob = await postQueue.getJob(post.jobId);
    if (oldJob) await oldJob.remove();
    post.jobId = null;
  }

  // Update fields
  post.title = title || post.title;
  post.postType = postType || post.postType;
  post.platform = platform || post.platform;
  post.caption = caption || post.caption;

  // Draft logic
  if (status === "Draft") {
    post.status = "Draft";

    if (scheduledAt) {
      post.scheduledAt = new Date(scheduledAt);
    }

    await post.save();
    return res.json(post);
  }

  // Scheduled logic
  if (status === "Scheduled" && scheduledAt) {
    const delay = new Date(scheduledAt).getTime() - Date.now();

    if (delay <= 0) {
      throw new Error("Scheduled time must be in future");
    }

    const job = await postQueue.add(
      "publish-post",
      { postId: post._id },
      { delay },
    );

    post.scheduledAt = new Date(scheduledAt);
    post.jobId = job.id;
    post.status = "Scheduled";
  }

  await post.save();
  res.json(post);
});

/* 🚀 TOGGLE POST STATUS (NEW) */

export const togglePostStatus = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new Error("Post not found");

  // ❌ HARD BLOCK
  if (post.status === "Posted") {
    res.status(400);
    throw new Error("Posted posts cannot be modified");
  }

  // 🔥 Remove existing job
  if (post.jobId) {
    const oldJob = await postQueue.getJob(post.jobId);
    if (oldJob) await oldJob.remove();
    post.jobId = null;
  }

  // 🔁 Toggle logic
  if (post.status === "Scheduled") {
    post.status = "Draft";
  } else {
    const delay = new Date(post.scheduledAt).getTime() - Date.now();

    if (delay <= 0) {
      res.status(400);
      throw new Error("Cannot schedule past time");
    }

    const job = await postQueue.add(
      "publish-post",
      { postId: post._id },
      { delay },
    );

    post.jobId = job.id;
    post.status = "Scheduled";
  }

  await post.save();
  res.json(post);
});

/* 🔥 RETRY POST */

export const retryPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new Error("Post not found");

  if (post.status !== "Failed") {
    return res
      .status(400)
      .json({ message: "Only failed posts can be retried" });
  }

  const job = await postQueue.add("publish-post", {
    postId: post._id,
  });

  post.status = "Scheduled";
  post.jobId = job.id;
  post.errorMessage = "";

  await post.save();

  res.json({ message: "Retry scheduled" });
});

/* 🔥 RESCHEDULE POST */

export const reschedulePost = asyncHandler(async (req, res) => {
  const { scheduledAt } = req.body;

  const post = await Post.findById(req.params.id);
  if (!post) throw new Error("Post not found");

  if (post.jobId) {
    const oldJob = await postQueue.getJob(post.jobId);
    if (oldJob) await oldJob.remove();
  }

  const delay = new Date(scheduledAt).getTime() - Date.now();
  if (delay <= 0) throw new Error("Invalid future time");

  const job = await postQueue.add(
    "publish-post",
    { postId: post._id },
    { delay },
  );

  post.scheduledAt = new Date(scheduledAt);
  post.status = "Scheduled";
  post.jobId = job.id;

  await post.save();

  res.json({ message: "Rescheduled successfully" });
});

/* DELETE */

export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new Error("Post not found");

  if (post.jobId) {
    const job = await postQueue.getJob(post.jobId);
    if (job) await job.remove();
  }

  await post.deleteOne();
  res.json({ message: "Deleted" });
});

/* GET */

export const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ brandId: req.params.brandId });
  res.json(posts);
});

export const getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new Error("Post not found");
  res.json(post);
});
