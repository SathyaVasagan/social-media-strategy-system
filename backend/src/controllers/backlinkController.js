import Backlink from "../models/Backlink.js";
import asyncHandler from "express-async-handler";

/* CREATE BACKLINK */

export const createBacklink = asyncHandler(async (req, res) => {
  const backlink = await Backlink.create(req.body);

  res.status(201).json(backlink);
});

/* GET BACKLINKS BY BRAND */

export const getBacklinks = asyncHandler(async (req, res) => {
  const backlinks = await Backlink.find({
    brandId: req.params.brandId,
  });

  res.json(backlinks);
});

/* GET SINGLE BACKLINK */

export const getBacklink = asyncHandler(async (req, res) => {
  const backlink = await Backlink.findById(req.params.id);

  if (!backlink) {
    res.status(404);
    throw new Error("Backlink not found");
  }

  res.json(backlink);
});

/* UPDATE BACKLINK */

export const updateBacklink = asyncHandler(async (req, res) => {
  const backlink = await Backlink.findById(req.params.id);

  if (!backlink) {
    res.status(404);
    throw new Error("Backlink not found");
  }

  Object.assign(backlink, req.body);

  const updated = await backlink.save();

  res.json(updated);
});

/* DELETE BACKLINK */

export const deleteBacklink = asyncHandler(async (req, res) => {
  const backlink = await Backlink.findById(req.params.id);

  if (!backlink) {
    res.status(404);
    throw new Error("Backlink not found");
  }

  await backlink.deleteOne();

  res.json({ message: "Backlink removed" });
});
