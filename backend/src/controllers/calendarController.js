import Calendar from "../models/Calendar.js";
import asyncHandler from "express-async-handler";

/* CREATE CALENDAR ENTRY */

export const createCalendar = asyncHandler(async (req, res) => {
  const { brandId, title, postType, platform, description, date } = req.body;

  const entry = await Calendar.create({
    brandId,
    title,
    postType,
    platform,
    description,
    date,
  });

  res.status(201).json(entry);
});

/* GET CALENDAR BY BRAND */

export const getCalendar = asyncHandler(async (req, res) => {
  const entries = await Calendar.find({ brandId: req.params.brandId });

  res.json(entries);
});

/* DELETE ENTRY */

export const deleteCalendar = asyncHandler(async (req, res) => {
  const entry = await Calendar.findById(req.params.id);

  if (!entry) {
    res.status(404);
    throw new Error("Entry not found");
  }

  await entry.deleteOne();

  res.json({ message: "Calendar entry removed" });
});

/* UPDATE ENTRY */

export const updateCalendar = asyncHandler(async (req, res) => {
  const entry = await Calendar.findById(req.params.id);

  if (!entry) {
    res.status(404);
    throw new Error("Entry not found");
  }

  Object.assign(entry, req.body);

  const updated = await entry.save();

  res.json(updated);
});
