const mongoose = require("mongoose");

const workforceSolutionCardSchema = new mongoose.Schema(
  {
    cardTitle: {
      type: String,
      required: true,
      trim: true,
    },
    cardDescription: {
      type: String,
      required: true,
      trim: true,
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
  mongoose.models.WorkforceSolutionCard ||
  mongoose.model("WorkforceSolutionCard", workforceSolutionCardSchema);
