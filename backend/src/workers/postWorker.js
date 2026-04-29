import { Worker } from "bullmq";
import connection from "../config/redis.js";
import Post from "../models/Post.js";
import Brand from "../models/Brand.js";
import axios from "axios";
import crypto from "crypto";

const LOCK_TTL = 60000; // 60 sec

const worker = new Worker(
  "post-queue",
  async (job) => {
    console.log("🔥 JOB RECEIVED:", job.name, job.data);

    const { postId } = job.data;

    const lockKey = `lock:post:${postId}`;
    const lockValue = crypto.randomUUID();

    // 🔒 Acquire Lock
    const lock = await connection.set(lockKey, lockValue, "NX", "PX", LOCK_TTL);

    if (!lock) {
      console.log("⛔ Lock exists, skipping:", postId);
      return;
    }

    try {
      console.log("🔐 Lock acquired:", postId);

      const post = await Post.findById(postId);
      if (!post) throw new Error("Post not found");

      // 🛑 Idempotency Guards
      if (post.externalPostId) {
        console.log("⚠️ Already executed:", postId);
        return;
      }

      if (post.status === "Posted") {
        console.log("⚠️ Already posted:", postId);
        return;
      }

      post.status = "Processing";
      await post.save();

      const brand = await Brand.findById(post.brandId);
      if (!brand) throw new Error("Brand not found");

      let fbResponse;

      if (post.platform === "Facebook") {
        const pageId = brand.facebook?.pageId;
        const token = brand.facebook?.accessToken;

        if (!pageId || !token) {
          throw new Error("Facebook not configured");
        }

        const message = post.caption;

        console.log("📤 Sending to Facebook:", postId);

        // 🎥 VIDEO
        if (post.postType === "Video") {
          fbResponse = await axios.post(
            `https://graph.facebook.com/v25.0/${pageId}/videos`,
            {
              file_url: post.mediaUrls[0],
              description: message,
              access_token: token,
            },
          );
        }

        // 📸 CAROUSEL
        else if (post.postType === "Carousel" && post.mediaUrls.length > 1) {
          const mediaIds = [];

          for (const url of post.mediaUrls) {
            const res = await axios.post(
              `https://graph.facebook.com/v25.0/${pageId}/photos`,
              {
                url,
                published: false,
                access_token: token,
              },
            );

            mediaIds.push({ media_fbid: res.data.id });
          }

          fbResponse = await axios.post(
            `https://graph.facebook.com/v25.0/${pageId}/feed`,
            {
              message,
              attached_media: mediaIds,
              access_token: token,
            },
          );
        }

        // 🖼️ IMAGE
        else if (post.mediaUrls.length > 0) {
          fbResponse = await axios.post(
            `https://graph.facebook.com/v25.0/${pageId}/photos`,
            {
              url: post.mediaUrls[0],
              caption: message,
              access_token: token,
            },
          );
        }

        // ✍️ TEXT
        else {
          fbResponse = await axios.post(
            `https://graph.facebook.com/v25.0/${pageId}/feed`,
            {
              message,
              access_token: token,
            },
          );
        }
      }

      // ✅ Save Result
      const externalId = fbResponse?.data?.id;

      post.externalPostId = externalId || "unknown_success";
      post.status = "Posted";

      await post.save();

      console.log("✅ JOB COMPLETED:", job.id, "| Post:", postId);
    } catch (error) {
      console.error(
        "❌ JOB FAILED:",
        job.id,
        error.response?.data || error.message,
      );

      const post = await Post.findById(postId);
      if (post) {
        post.status = "Failed";
        post.errorMessage =
          error.response?.data?.error?.message || error.message;
        await post.save();
      }

      throw error;
    } finally {
      // 🔓 Release Lock
      const currentValue = await connection.get(lockKey);

      if (currentValue === lockValue) {
        await connection.del(lockKey);
        console.log("🔓 Lock released:", postId);
      }
    }
  },
  {
    connection,
    concurrency: 2, // 🔥 LIMIT (IMPORTANT)
  }
);

// ===============================
// 🔥 WORKER EVENT LISTENERS
// ===============================

worker.on("active", (job) => {
  console.log(`🚀 Job started: ${job.id}`);
});

worker.on("completed", (job) => {
  console.log(`✅ Job completed event: ${job.id}`);
});

worker.on("failed", async (job, err) => {
  console.error(`💥 Worker failure event: ${job.id}`);
  console.error(`🔁 Retry attempt: ${job.attemptsMade}`);
  console.error("Error:", err.message);

  const post = await Post.findById(job.data.postId);
  if (!post) return;

  post.status = "Failed";
  post.errorMessage = err.message;
  await post.save();
});

console.log("🚀 Worker started with distributed locking");
