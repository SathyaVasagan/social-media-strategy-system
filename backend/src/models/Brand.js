import mongoose from "mongoose";

const brandSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    field: {
      type: String,
      required: true,
    },

    logo: {
      type: String,
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // 🔥 NEW: SOCIAL ACCOUNTS
    facebook: {
      pageId: String,
      accessToken: String,
    },

    instagram: {
      pageId: String,
      accessToken: String,
    },

    x: {
      username: String,
      apiKey: String,
    },

    youtube: {
      channelId: String,
      accessToken: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Brand", brandSchema);
