const mongoose = require("mongoose");

const journeyTimelineCardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    year: {
      type: String,
      required: true,
      trim: true,
    },
    side: {
      type: String,
      enum: ["left", "right"],
      default: "left",
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.JourneyTimelineCard ||
  mongoose.model("JourneyTimelineCard", journeyTimelineCardSchema);
