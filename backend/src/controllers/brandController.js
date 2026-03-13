import Brand from "../models/Brand.js";
import asyncHandler from "express-async-handler";

/* CREATE BRAND */

export const createBrand = asyncHandler(async (req, res) => {
  const { name, field, logo } = req.body;

  const existingBrand = await Brand.findOne({
    name,
    ownerId: req.user._id,
  });

  if (existingBrand) {
    res.status(400);
    throw new Error("Brand name already exists");
  }

  const brand = await Brand.create({
    name,
    field,
    logo,
    ownerId: req.user._id,
  });

  res.status(201).json(brand);
});

/* GET ALL BRANDS */

export const getBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find({
    ownerId: req.user._id,
  }).sort({ createdAt: -1 });

  res.json(brands);
});

/* GET SINGLE BRAND */

export const getBrandById = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);

  if (!brand) {
    res.status(404);
    throw new Error("Brand not found");
  }

  if (brand.ownerId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  res.json(brand);
});

/* DELETE BRAND */

export const deleteBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);

  if (!brand) {
    res.status(404);
    throw new Error("Brand not found");
  }

  if (brand.ownerId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to delete this brand");
  }

  await brand.deleteOne();

  res.json({ message: "Brand removed" });
});
