import asyncHandler from "express-async-handler";
import mongoose from "mongoose";

import Post from "../models/Post.js";
import Calendar from "../models/Calendar.js";
import Backlink from "../models/Backlink.js";
import Brand from "../models/Brand.js";

export const getBrandAnalytics = asyncHandler(async (req, res) => {
  const { brandId } = req.params;

  const brandObjectId = new mongoose.Types.ObjectId(brandId);

  /* VERIFY BRAND OWNERSHIP */

  const brand = await Brand.findById(brandObjectId);

  if (!brand) {
    res.status(404);
    throw new Error("Brand not found");
  }

  if (brand.ownerId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to view this brand's analytics");
  }

  /* SUMMARY CARDS */

  const totalPosts = await Post.countDocuments({ brandId });
  const plannedPosts = await Calendar.countDocuments({ brandId });
  const totalBacklinks = await Backlink.countDocuments({ brandId });

  /* CONTENT TYPE DISTRIBUTION */

  const contentTypeStats = await Post.aggregate([
    { $match: { brandId: brandObjectId } },
    {
      $group: {
        _id: "$postType",
        count: { $sum: 1 },
      },
    },
  ]);

  /* PLATFORM DISTRIBUTION */

  const platformStats = await Post.aggregate([
    { $match: { brandId: brandObjectId } },
    {
      $group: {
        _id: "$platform",
        count: { $sum: 1 },
      },
    },
  ]);

  /* STATUS DISTRIBUTION */

  const statusStats = await Post.aggregate([
    { $match: { brandId: brandObjectId } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  /* POSTING FREQUENCY */

  const postingFrequency = await Post.aggregate([
    { $match: { brandId: brandObjectId } },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%b %d",
            date: "$scheduledAt",
            timezone: "UTC",
          },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  /* BACKLINK ACTIVITY */

  const backlinkActivity = await Backlink.aggregate([
    { $match: { brandId: brandObjectId } },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%b %d",
            date: "$date",
            timezone: "UTC",
          },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  /* CUMULATIVE BACKLINK GROWTH */

  let cumulative = 0;

  const backlinkFrequency = backlinkActivity.map((item) => {
    cumulative += item.count;

    return {
      _id: item._id,
      count: cumulative,
    };
  });

  /* 🚀 DECISION ENGINE */

  const total = totalPosts || 1;

  let bestPlatform = null;
  let worstPlatform = null;

  if (platformStats.length > 0) {
    bestPlatform = platformStats.reduce((a, b) => (a.count > b.count ? a : b));

    worstPlatform = platformStats.reduce((a, b) => (a.count < b.count ? a : b));
  }

  const failed = statusStats.find((s) => s._id === "Failed")?.count || 0;

  const failureRate = ((failed / total) * 100).toFixed(1);

  const postCounts = postingFrequency.map((p) => p.count);

  const avg = postCounts.reduce((a, b) => a + b, 0) / (postCounts.length || 1);

  const variance =
    postCounts.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) /
    (postCounts.length || 1);

  const consistencyScore = Math.max(0, 100 - variance * 10).toFixed(0);

  /* RESPONSE */

  res.json({
    cards: {
      totalPosts,
      plannedPosts,
      totalBacklinks,
    },

    insights: {
      bestPlatform,
      worstPlatform,
      failureRate,
      consistencyScore,
    },

    charts: {
      contentTypeStats,
      platformStats,
      statusStats,
      postingFrequency,
      backlinkFrequency,
    },
  });
});
