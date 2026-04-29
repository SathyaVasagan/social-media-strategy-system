import Post from "../models/Post.js";
import { postQueue } from "./postQueue.js";

export const recoverMissedJobs = async () => {
  const now = new Date();

  const missedPosts = await Post.find({
    status: "Scheduled",
    scheduledAt: { $lt: now },
  });

  console.log(`♻️ Recovering ${missedPosts.length} missed jobs`);

  for (const post of missedPosts) {
    try {
      const job = await postQueue.add("publish-post", {
        postId: post._id,
      });

      post.jobId = job.id;
      await post.save();

      console.log("♻️ Recovered:", post._id);
    } catch (err) {
      console.error("Recovery failed:", err.message);
    }
  }
};
