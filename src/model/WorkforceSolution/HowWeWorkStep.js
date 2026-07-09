const mongoose = require("mongoose");

const howWeWorkStepSchema = new mongoose.Schema(
  {
    stepNumber: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
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
  mongoose.models.HowWeWorkStep ||
  mongoose.model("HowWeWorkStep", howWeWorkStepSchema);
