import { Queue } from "bullmq";
import connection from "../config/redis.js";

export const postQueue = new Queue("post-queue", {
  connection,
  defaultJobOptions: {
    removeOnComplete: true,
    attempts: 3,
  },
});
