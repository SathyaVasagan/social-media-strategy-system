import mongoose from "mongoose";

const calendarSchema = mongoose.Schema(
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

    description: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Calendar", calendarSchema);
