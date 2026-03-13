import Brand from "../models/Brand.js";
import Post from "../models/Post.js";
import Calendar from "../models/Calendar.js";
import Backlink from "../models/Backlink.js";
import asyncHandler from "express-async-handler";

export const getDashboardStats = asyncHandler(async (req, res) => {
  const brands = await Brand.countDocuments({
    ownerId: req.user._id,
  });

  const posts = await Post.countDocuments();

  const planned = await Calendar.countDocuments();

  const backlinks = await Backlink.countDocuments();

  res.json({
    brands,
    posts,
    planned,
    backlinks,
  });
});
