import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import "./workers/postWorker.js";

import authRoutes from "./routes/authRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import calendarRoutes from "./routes/calendarRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import backlinkRoutes from "./routes/backlinkRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

import { errorHandler } from "./middleware/errorMiddleware.js";

import { initBullBoard } from "./utils/bullBoard.js";
import { recoverMissedJobs } from "./jobs/recoveryService.js";

const startServer = async () => {
  try {
    await connectDB();

    const app = express();

    app.use(cors());
    app.use(express.json());

    // 🔥 Bull Board
    const serverAdapter = initBullBoard();
    app.use("/admin/queues", serverAdapter.getRouter());

    // 🔥 Routes
    app.use("/api/auth", authRoutes);
    app.use("/api/brands", brandRoutes);
    app.use("/api/calendar", calendarRoutes);
    app.use("/api/posts", postRoutes);
    app.use("/api/backlinks", backlinkRoutes);
    app.use("/api/analytics", analyticsRoutes);
    app.use("/api/dashboard", dashboardRoutes);

    app.use(errorHandler);

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, async () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Bull Board: http://localhost:${PORT}/admin/queues`);

      // 🔥 Recovery
      await recoverMissedJobs();
    });
  } catch (error) {
    console.error("❌ SERVER START ERROR:", error);
    process.exit(1);
  }
};

startServer();
