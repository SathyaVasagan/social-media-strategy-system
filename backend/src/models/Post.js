import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },

    title: {
      type: String,
      required: true,
    },

    postType: {
      type: String,
      required: true,
    },

    platform: {
      type: String,
      required: true,
    },

    caption: {
      type: String,
      required: true,
    },

    mediaLink: {
      type: String,
      required: true,
    },

    scheduledDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Post", postSchema);
