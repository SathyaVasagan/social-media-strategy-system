import Brand from "../models/Brand.js";
import Post from "../models/Post.js";
import Calendar from "../models/Calendar.js";
import Backlink from "../models/Backlink.js";
import asyncHandler from "express-async-handler";

export const getDashboardStats = asyncHandler(async (req, res) => {
  // 🔥 1. USER BRANDS COUNT
  const brands = await Brand.countDocuments({
    ownerId: req.user._id,
  });

  // 🔥 2. GET USER BRAND IDS
  const userBrands = await Brand.find({ ownerId: req.user._id }, "_id");

  const brandIds = userBrands.map((b) => b._id);

  // ⚠️ EDGE CASE: NO BRANDS
  if (brandIds.length === 0) {
    return res.json({
      brands: 0,
      posts: 0,
      planned: 0,
      backlinks: 0,

      // 🚀 NEW DEFAULTS
      alerts: {
        missedPosts: 0,
        drafts: 0,
      },

      upcoming: [],
    });
  }

  // 🔥 3. BASIC COUNTS
  const posts = await Post.countDocuments({
    brandId: { $in: brandIds },
  });

  const planned = await Calendar.countDocuments({
    brandId: { $in: brandIds },
  });

  const backlinks = await Backlink.countDocuments({
    brandId: { $in: brandIds },
  });

  // 🚀 4. FETCH POSTS (FOR INTELLIGENCE)
  const userPosts = await Post.find({
    brandId: { $in: brandIds },
  });

  const now = new Date();

  // ⚠️ MISSED POSTS
  const missedPosts = userPosts.filter(
    (p) =>
      p.status === "Scheduled" &&
      p.scheduledAt &&
      new Date(p.scheduledAt) < now,
  ).length;

  // ⚠️ DRAFT POSTS
  const drafts = userPosts.filter((p) => p.status === "Draft").length;

  // 📅 UPCOMING POSTS (NEXT 24 HOURS)
  const upcoming = userPosts
    .filter(
      (p) =>
        p.scheduledAt &&
        new Date(p.scheduledAt) > now &&
        new Date(p.scheduledAt) < new Date(now.getTime() + 24 * 60 * 60 * 1000),
    )
    .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))
    .slice(0, 5);

  // 🚀 FINAL RESPONSE
  res.json({
    brands,
    posts,
    planned,
    backlinks,

    alerts: {
      missedPosts,
      drafts,
    },

    upcoming,
  });
});
