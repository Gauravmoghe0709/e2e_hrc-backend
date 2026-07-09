const mongoose = require("mongoose");

const howWeWorkSectionSchema = new mongoose.Schema(
  {
    badgeText: {
      type: String,
      default: "OUR PROVEN PROCESS",
      trim: true,
    },
    sectionTitle: {
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
  mongoose.models.HowWeWorkSection ||
  mongoose.model("HowWeWorkSection", howWeWorkSectionSchema);
