import mongoose from "mongoose";

const backlinkSchema = mongoose.Schema(
  {
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },

    userName: {
      type: String,
      required: true,
    },

    platform: {
      type: String,
      required: true,
    },

    contentTitle: {
      type: String,
      required: true,
    },

    contentBody: {
      type: String,
      required: true,
    },

    backlinkUrl: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      default: "Live",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Backlink", backlinkSchema);
