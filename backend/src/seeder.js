import mongoose from "mongoose";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import User from "./models/User.js";
import Brand from "./models/Brand.js";
import Post from "./models/Post.js";
import Calendar from "./models/Calendar.js";
import Backlink from "./models/Backlink.js";

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log("Clearing database...");

    await User.deleteMany();
    await Brand.deleteMany();
    await Post.deleteMany();
    await Calendar.deleteMany();
    await Backlink.deleteMany();

    console.log("Creating demo user...");

    const user = await User.create({
      name: "Demo User",
      email: "demo@example.com",
      password: "123456",
      role: "team_member",
    });

    console.log("Creating brands...");

    const brands = await Brand.insertMany([
      {
        name: "Tesla",
        field: "Automotive",
        logo: "",
        ownerId: user._id,
      },
      {
        name: "Nike",
        field: "Sportswear",
        logo: "",
        ownerId: user._id,
      },
    ]);

    console.log("Creating calendar plans...");

    await Calendar.insertMany([
      {
        brandId: brands[0]._id,
        title: "Tesla Launch Campaign",
        postType: "Reel",
        platform: "Instagram",
        description: "New Tesla product teaser",
        date: new Date(),
      },
      {
        brandId: brands[1]._id,
        title: "Nike Summer Drop",
        postType: "Carousel",
        platform: "Instagram",
        description: "Promote new sneakers",
        date: new Date(),
      },
    ]);

    console.log("Creating posts...");

    await Post.insertMany([
      {
        brandId: brands[0]._id,
        title: "Tesla Model Update",
        postType: "Video",
        platform: "YouTube",
        caption: "Watch the latest Tesla reveal",
        mediaLink: "https://youtube.com",
        scheduledDate: new Date(),
        status: "Scheduled",
      },
      {
        brandId: brands[1]._id,
        title: "Nike Athlete Campaign",
        postType: "Static",
        platform: "Instagram",
        caption: "Train harder with Nike",
        mediaLink: "https://instagram.com",
        scheduledDate: new Date(),
        status: "Draft",
      },
    ]);

    console.log("Creating backlinks...");

    await Backlink.insertMany([
      {
        brandId: brands[0]._id,
        userName: "SEO Team",
        platform: "Reddit",
        contentTitle: "Tesla Battery Discussion",
        contentBody: "Discussion about Tesla battery efficiency",
        backlinkUrl: "https://reddit.com",
        date: new Date(),
        status: "Live",
      },
      {
        brandId: brands[1]._id,
        userName: "Marketing Team",
        platform: "Quora",
        contentTitle: "Best running shoes",
        contentBody: "Answer recommending Nike running shoes",
        backlinkUrl: "https://quora.com",
        date: new Date(),
        status: "Live",
      },
    ]);

    console.log("Demo data created successfully");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();
