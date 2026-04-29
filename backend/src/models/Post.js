import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },

    title: { type: String, required: true },

    postType: {
      type: String,
      enum: ["Static", "Carousel", "Reel", "Video"],
      required: true,
    },

    platform: {
      type: String,
      enum: ["Instagram", "Facebook", "X", "YouTube"],
      required: true,
    },

    caption: { type: String, required: true },

    mediaUrls: [String],

    scheduledAt: {
      type: Date,
      required: true,
    },

    jobId: { type: String },

    externalPostId: { type: String },

    status: {
      type: String,
      enum: ["Draft", "Processing", "Scheduled", "Posted", "Failed"],
      default: "Processing",
      index: true,
    },

    errorMessage: String,
  },
  { timestamps: true },
);

export default mongoose.model("Post", postSchema);
