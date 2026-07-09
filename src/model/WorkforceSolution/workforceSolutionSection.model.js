const mongoose = require("mongoose");

const workforceSolutionSectionSchema = new mongoose.Schema(
  {
    badgeText: {
      type: String,
      default: "WHAT WE OFFER",
      trim: true,
    },
    titleLine1: {
      type: String,
      required: true,
      trim: true,
    },
    highlightedTitle: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.WorkforceSolutionSection ||
  mongoose.model("WorkforceSolutionSection", workforceSolutionSectionSchema);
