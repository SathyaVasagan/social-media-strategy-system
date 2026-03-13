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

  /* PLATFORM DISTRIBUTION (NEW FIX) */

  const platformStats = await Post.aggregate([
    { $match: { brandId: brandObjectId } },
    {
      $group: {
        _id: "$platform",
        count: { $sum: 1 },
      },
    },
  ]);

  /* POSTING FREQUENCY */

  const postingFrequency = await Post.aggregate([
    { $match: { brandId: brandObjectId } },
    {
      $group: {
        _id: { $week: "$scheduledDate" },
        count: { $sum: 1 },
      },
    },
  ]);

  /* BACKLINK GROWTH */

  const backlinkFrequency = await Backlink.aggregate([
    { $match: { brandId: brandObjectId } },
    {
      $group: {
        _id: { $week: "$date" },
        count: { $sum: 1 },
      },
    },
  ]);

  res.json({
    cards: {
      totalPosts,
      plannedPosts,
      totalBacklinks,
    },
    charts: {
      contentTypeStats,
      platformStats, // 👈 important
      postingFrequency,
      backlinkFrequency,
    },
  });
});
